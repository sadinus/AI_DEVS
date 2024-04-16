import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, BaseMessageChunk } from "@langchain/core/messages";
import { authorize, getTask, submitAnswer } from "./api";

type Task = {
  msg: string;
  hint: string;
  question: string;
};

const { token } = await authorize("tools");
const { msg, hint, question } = await getTask<Task>(token);

const intentSchema = {
  name: "describe_intention",
  description: msg,
  parameters: {
    type: "object",
    properties: {
      tool: {
        type: "string",
        description: `
                Type has to be set to either:
                'Todo' — when you are asked to do something
                'Caledar' — should be used for all tasks when the date is provided as part of the question. Even if the date is passed as "tomorrow", "next week", "pojutrze" etc.
                `,
      },
      desc: {
        type: "string",
        description: `
        Simplify the text to a fact:
        Example
        "Przypomnij mi, że mam kupić mleko" = "Kup mleko"
        Example 2
        "Jutro mam spotkanie z Marianem" = "Spotkanie z Mariuszem"
        `,
      },
      date: {
        type: "string",
        description: `
        date of the event in the YYYY-MM-DD format
        `,
      },
    },
    required: ["tool", "desc"],
  },
};

const parseFunctionCall = (
  result: BaseMessageChunk
): { name: string; args: any } | null => {
  if (result?.additional_kwargs?.function_call === undefined) {
    return null;
  }
  return {
    name: result.additional_kwargs.function_call.name,
    args: JSON.parse(result.additional_kwargs.function_call.arguments),
  };
};

const model = new ChatOpenAI({
  modelName: "gpt-4-0613",
}).bind({ functions: [intentSchema] });

const result = await model.invoke([
  new HumanMessage(
    `Current date is ${new Date().toISOString().slice(0, 10)}. ${question}`
  ),
]);

const action = parseFunctionCall(result);

console.log(action);

submitAnswer(action?.args, token);

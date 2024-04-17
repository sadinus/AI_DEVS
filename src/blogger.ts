import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { authorize, getTask, submitAnswer } from "./api";

type Task = {
  blog: string[];
  msg: string;
};

const { token } = await authorize("blogger");
const { blog, msg: systemMessage } = await getTask<Task>(token);

const chat = new ChatOpenAI();

chat.invoke([new SystemMessage(systemMessage)]),
  Promise.all(
    blog.map((outline) =>
      chat
        .invoke([new HumanMessage(outline)])
        .then((res) => res.lc_kwargs.content)
    )
  ).then((response) => submitAnswer(response, token));

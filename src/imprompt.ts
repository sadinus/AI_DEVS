import { SystemMessage } from "@langchain/core/messages";
import { authorize, getTask, submitAnswer } from "./api";
import { ChatOpenAI } from "@langchain/openai";

type Task = {
  input: string[];
  question: string;
};

const { token } = await authorize("inprompt");
const { input, question: query } = await getTask<Task>(token);

const chat = new ChatOpenAI();

const { content: name } = await chat.invoke([
  new SystemMessage(`Find name in sentence: ${query}`),
]);

const filteredSentences = input
  .filter((sentence: string) => sentence.includes(name.toString()))
  .join("\n");

const { content: answer } = await chat.invoke([
  new SystemMessage(`Using one of the following resources
  Sources###
  ${filteredSentences}
  ###
  Answer to question: ${query}`),
]);

console.log("answer: ", answer);

submitAnswer(answer, token);

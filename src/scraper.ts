import { ChatOpenAI } from "@langchain/openai";
import { authorize, fetchScraper, getTask, submitAnswer } from "./api";
import { SystemMessage } from "@langchain/core/messages";

type Task = {
  msg: string;
  input: string;
  question: string;
};

const { token } = await authorize("scraper");
const {
  msg: systemMessage,
  input: inputUrl,
  question,
} = await getTask<Task>(token);

const article = await fetchScraper(inputUrl);

const chat = new ChatOpenAI();

const { content: answer } = await chat.invoke([
  new SystemMessage(`${systemMessage}.\n
  Article: ${article} \n
  Question: ${question}`),
]);

submitAnswer(answer, token);

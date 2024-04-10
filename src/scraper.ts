import { ChatOpenAI } from "@langchain/openai";
import { authorize, getTask, submitAnswer } from "./api";
import { SystemMessage } from "langchain/schema";

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

const fetchArticle = async (url: string) => {
  const headers = new Headers();
  headers.append(
    "User-Agent",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36"
  );

  let response;
  let responseData;

  while (!responseData) {
    try {
      response = await fetch(url, {
        headers: headers,
      });

      if (response.status === 500) {
        console.log("Server returned 500, retrying...");
        continue; // Retry fetching
      }

      if (response.ok) {
        responseData = await response.text();
        break;
      } else {
        throw new Error(`Failed to fetch data. Code ${response.status}`);
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      continue; // Retry fetching
    }
  }

  return responseData;
};

const inputFile = await fetchArticle(inputUrl);

const chat = new ChatOpenAI();

const { content: answer } = await chat.invoke([
  new SystemMessage(`${systemMessage}.\n
  Article: ${inputFile} \n
  Question: ${question}`),
]);

submitAnswer(answer, token);

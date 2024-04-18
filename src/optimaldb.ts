import { ChatOpenAI } from "@langchain/openai";
import { authorize, getTask, submitAnswer } from "./api";
import { SystemMessage } from "@langchain/core/messages";

type Task = {
  msg: string;
  database: string;
};

const { token } = await authorize("optimaldb");
const { msg, database: databaseUrl } = await getTask<Task>(token);
const chat = new ChatOpenAI();

const database = await fetchDb(databaseUrl);

const { content: shortedDatabase } = await chat.invoke([
  new SystemMessage(`${msg} Focus on preserving all the information, but make it as short as possible. Don't replace any word, just make it more concise. \n
  ###Database ${JSON.stringify(database)} \n
  ###Example Input: "ania": ["Jennifer Lopez to inspiracja fitnessowa dla Ani, zw\u0142aszcza je\u015bli chodzi o taniec i ruch sceniczny.", W wolnych chwilach Ania prowadzi kana\u0142 na YouTube, gdzie dzieli si\u0119 poradami z zakresu beauty."] \n
  ###Example Output: "ania": ["jej inspiracja fitnessowa to Jeniffer Lopez", "ma kanał na Youtube o beauty"] \n
  Think step by step.`),
]);

console.log(shortedDatabase);

submitAnswer(shortedDatabase, token);

async function fetchDb(url: string) {
  const response = await fetch(url).then((res) => res.json());

  return response;
}

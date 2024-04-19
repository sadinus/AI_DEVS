import { ChatOpenAI } from "@langchain/openai";
import { authorize, getTask, submitAnswer } from "./api";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

type Task = {
  database: string;
};

const { token } = await authorize("optimaldb");
const { database: databaseUrl } = await getTask<Task>(token);
const chat = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  maxTokens: 1000,
});

const database = await fetchDb(databaseUrl);

const people = Object.keys(database);

const peopleDatabase = people.map((person) => database[person]);

let shortedDatabase = [];

for (let i = 0; i < people.length; i++) {
  const person = people[i];
  const info = peopleDatabase[i];
  const personInfo = await shortenPersonInfo(person, info);
  shortedDatabase.push(personInfo);
}

console.log(shortedDatabase);

submitAnswer(shortedDatabase.toString(), token);

async function fetchDb(url: string) {
  const response = await fetch(url).then((res) => res.json());
  return response;
}

async function shortenPersonInfo(person: string, info: string[]) {
  const { content: shortedpersonInfo } = await chat.invoke([
    new SystemMessage(`Transform string array into bullet point list that contains SAME AMOUNT OF ELEMENTS. Focus on facts. Make each bullet point more concise than array element, so it carries the same information, but in a fewer words. \n
      ###Example Input: ANIA: ["Jennifer Lopez to inspiracja fitnessowa dla Ani, zwłaszcza jeśli chodzi o taniec i ruch sceniczny.", "W wolnych chwilach Ania prowadzi kanał na YouTube, gdzie dzieli się poradami z zakresu beauty."]
      ###Example Output: 
      ANIA:
      - inspiracja fitnessowa to Jeniffer Lopez
      - ma kanał na Youtube o beauty \n
      Do it step by step e.g. shorten 5 elements, then next 5 and so on...
      Like this:
      ANIA:
      // transform first 5 elements from array and remember where you finished
      - ...
      - ...
      - ...
      - ...
      - ...
      // then transform next 5 elements and continue the list
      - ...
      - ...
      - ...
      - ...
      - ...
      ###`),
    new HumanMessage(`${person.toUpperCase()}: ${info.toString()}`),
  ]);

  return shortedpersonInfo.toString();
}

import { ChatOpenAI } from "@langchain/openai";
import { authorize, getTask, submitAnswer } from "./api";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

type Person = {
  imie: string;
  nazwisko: string;
  wiek: 54;
  o_mnie: string;
  ulubiona_postac_z_kapitana_bomby: string;
  ulubiony_serial: string;
  ulubiony_film: string;
  ulubiony_kolor: string;
};

const { token } = await authorize("people");
const { question } = await getTask(token);
const chat = new ChatOpenAI();

const person = await findPersonBasedOnQuestion(question);

const { content: answer } = await chat.invoke([
  new SystemMessage(`Answer only based on your context. \n
  ###Context ${JSON.stringify(person)} \n
  Answer to question: ${question}`),
]);

submitAnswer(answer, token);

async function findPersonBasedOnQuestion(question: string): Promise<Person> {
  const people = (await fetch("https://tasks.aidevs.pl/data/people.json").then(
    (response) => response.json()
  )) as Person[];

  const { content } = await chat.invoke([
    new SystemMessage(`Return json object that looks as follows:\n
    ###Input: co lubi jesc Tomek Bzik? \n
    ###Answer: {
      "imie": "Tomasz",
      "nazwisko": "Bzik",
      "question": "co lubi jesc"
    } \n
    ###Input2: Gdzie mieszka Krysia Ludek? \n
    ###Answer2: {
      "imie": "Krystyna",
      "nazwisko": "Ludek",
      "question": "gdzie mieszka"
    } \n`),
    new HumanMessage(question),
  ]);

  const questionPerson = JSON.parse(content.toString()) as Person;

  const dbPerson = people.find(
    (person) =>
      person.imie === questionPerson.imie &&
      person.nazwisko === questionPerson.nazwisko
  );

  return dbPerson as Person;
}

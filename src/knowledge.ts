import { ChatOpenAI } from "@langchain/openai";
import { authorize, getTask, submitAnswer } from "./api";
import { SystemMessage } from "@langchain/core/messages";

type Response = {
  question: string;
};

const { token } = await authorize("knowledge");
const { question } = await getTask<Response>(token);
const chat = new ChatOpenAI();

const { content } = await chat.invoke([
  new SystemMessage(
    `If question contains word "population" return 2, if question contains word "currency" return 1, otherwise return 0. Question will be asked in polish. \n
    Example: Jaka jest populacja Czech? \n
    Answer: 2 \n
    Example2: Podaj aktualny kurs EURO \n
    Answer: 1 \n
    Question: ${question}`
  ),
]);

const questionType = Number(content);

let answer;

switch (questionType) {
  case 1:
    answer = await getExchangeRate();
    break;
  case 2:
    answer = await getCountryPopulation();
    break;
  default:
    answer = await answerToQuestion();
    break;
}

submitAnswer(answer, token);

async function getExchangeRate() {
  const { content: code } = await chat.invoke([
    new SystemMessage(
      `Get currency code for currency mentioned in question: ${question}`
    ),
  ]);
  const currencyInfo = await fetch(
    `http://api.nbp.pl/api/exchangerates/rates/a/${code}/`
  ).then((res) => res.json());

  return currencyInfo.rates[0].mid;
}

async function getCountryPopulation() {
  const { content: country } = await chat.invoke([
    new SystemMessage(
      `Get lowercased country mentioned in question: ${question} \n
      Always return answer in english.`
    ),
  ]);

  console.log("country:", country);

  const countryInfo = await fetch(
    `https://restcountries.com/v3.1/name/${country}?fullText=true`
  ).then((res) => res.json());

  return countryInfo[0].population;
}

async function answerToQuestion() {
  const { content: answer } = await chat.invoke([new SystemMessage(question)]);
  return answer;
}

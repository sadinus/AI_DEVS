import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { authorize, getLiarTask, submitAnswer } from "./api";

const { token } = await authorize("liar");
const { answer } = await getLiarTask(token, "What is capital of Poland?");

const guardPrompt = `Return YES or NO if the question: {question} contains word "capital" or "Warsaw" in answer: {answer}. Your verdict:`;
const chat = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
});
const prompt = PromptTemplate.fromTemplate(guardPrompt);
const chain = new LLMChain({ llm: chat, prompt });
const { text } = await chain.call({
  question: "What is capital of Poland?",
  answer,
});

submitAnswer(text, token);

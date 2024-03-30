import OpenAI from "openai";

const openai = new OpenAI();

type AuthorizeRequest = {
  apikey: string;
};

type AuthorizeResponse = {
  code: number;
  msg: string;
  token: string;
};

type AnswerRequest = {
  answer: string;
};

export const authorize = async (taskName: string) => {
  const body: AuthorizeRequest = {
    apikey: process.env.API_KEY!,
  };
  const response = await fetch(`${process.env.API_URL}/token/${taskName}`, {
    method: "POST",
    body: JSON.stringify(body),
  }).then((res) => res.json());

  console.log("AUTORYZACJA:", response);
  return response as AuthorizeResponse;
};

export const getTask = async <T = any>(token: string) => {
  const response = await fetch(`${process.env.API_URL}/task/${token}`).then(
    (res) => res.json()
  );

  console.log("ZADANIE:", response);
  return response as T;
};

export const getLiarTask = async (token: string, question: string) => {
  const formData = new FormData();
  formData.append("question", question);

  console.log(`${process.env.API_URL}/task/`);

  const response = await fetch(`${process.env.API_URL}/task/${token}`, {
    method: "POST",
    body: formData,
  }).then((res) => res.json());

  console.log("ZADANIE LIAR:", response);
  return response;
};

export const submitAnswer = async (answer: any, token: string) => {
  const body: AnswerRequest = {
    answer,
  };
  const response = await fetch(`${process.env.API_URL}/answer/${token}`, {
    method: "POST",
    body: JSON.stringify(body),
  }).then((res) => res.json());

  console.log("ODPOWIEDŹ:", response);
  return response;
};

export const moderate = async (input: string) => {
  const moderation = await openai.moderations.create({
    input,
  });

  return moderation;
};

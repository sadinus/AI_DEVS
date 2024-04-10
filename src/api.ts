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

export const transformToEmbeddings = async (input: string) => {
  const embedding = await openai.embeddings.create({
    input,
    model: "text-embedding-ada-002",
  });

  return embedding.data[0].embedding;
};

export const fetchScraper = async (url: string) => {
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

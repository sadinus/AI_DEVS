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

  console.log("AUTORYZACJA:");
  console.log(response);
  return response as AuthorizeResponse;
};

export const getTask = async (token: string) => {
  const response = await fetch(`${process.env.API_URL}/task/${token}`).then(
    (res) => res.json()
  );

  console.log("ZADANIE:");
  console.log(response);
  return response;
};

export const submitAnswer = async (answer: string, token: string) => {
  const body: AnswerRequest = {
    answer,
  };
  const response = await fetch(`${process.env.API_URL}/answer/${token}`, {
    method: "POST",
    body: JSON.stringify(body),
  }).then((res) => res.json());

  console.log("ODPOWIEDŹ:");
  console.log(response);
  return response;
};

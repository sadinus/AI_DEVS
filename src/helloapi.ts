import { authorize, getTask, submitAnswer } from "./api";

type Response = {
  msg: string;
  cookie: string;
};

const { token } = await authorize("helloapi");
const { cookie } = await getTask<Response>(token);

submitAnswer(cookie, token);

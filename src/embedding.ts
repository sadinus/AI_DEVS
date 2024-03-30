import { authorize, getTask, submitAnswer, transformToEmbeddings } from "./api";

const { token } = await authorize("embedding");
await getTask(token);

const input = "Hawaiian pizza";

const answer = await transformToEmbeddings(input);

submitAnswer(answer, token);

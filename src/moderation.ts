import { authorize, getTask, moderate, submitAnswer } from "./api";

type Task = {
  input: string[];
};

const { token } = await authorize("moderation");
const { input } = await getTask<Task>(token);

Promise.all(
  input.map((sentence) =>
    moderate(sentence).then((res) => (res.results[0].flagged ? 1 : 0))
  )
).then((response) => {
  console.log(response);
  submitAnswer(response, token);
});

import { moderate, submitAnswer } from "./api";

const sentencesToModerate: string[] = ["", "", "", ""];

Promise.all(
  sentencesToModerate.map((sentence) =>
    moderate(sentence).then((res) => (res.results[0].flagged ? 1 : 0))
  )
).then((response) => {
  console.log(response);
  submitAnswer(response, "");
});

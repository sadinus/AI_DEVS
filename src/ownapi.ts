import { ChatOpenAI } from "@langchain/openai";
import { authorize, getTask, submitAnswer } from "./api";
import { SystemMessage } from "@langchain/core/messages";
import express from "express";

const { token } = await authorize("ownapi");
await getTask(token);

const app = express();
app.use(express.json());

const model = new ChatOpenAI();

app.post("/", async (req, res) => {
  const { question } = req.body;
  const { content } = await model.invoke([new SystemMessage(question)]);

  const answer = {
    reply: content,
  };

  res.send(JSON.stringify(answer));
});

app.listen(3000);

// https://ngrok.com/docs/getting-started/ run ngrog from script
submitAnswer(process.env.OWN_API_URL, token);

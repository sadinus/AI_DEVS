import express from "express";
import { authorize, getTask, submitAnswer } from "./api";
import { OpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";

const { token } = await authorize("ownapipro");
await getTask(token);

const app = express();
app.use(express.json());

const model = new OpenAI({});
const memory = new BufferMemory();
const chain = new ConversationChain({ llm: model, memory: memory });

app.post("/", async (req, res) => {
  const { question } = req.body;
  const { response } = await chain.call({ input: question });

  console.log(question);
  console.log(response);

  const answer = {
    reply: response,
  };

  res.send(JSON.stringify(answer));
});

app.listen(3000);

// https://ngrok.com/docs/getting-started/ run ngrog from script
submitAnswer(process.env.OWN_API_URL, token);

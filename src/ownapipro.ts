import express from "express";
import { authorize, getTask, submitAnswer } from "./api";
import { OpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { SystemMessage } from "@langchain/core/messages";

const { token } = await authorize("ownapipro");
await getTask(token);

const app = express();
app.use(express.json());

const model = new OpenAI({
  modelName: "gpt-3.5-turbo",
});

const memory = new BufferMemory({
  chatHistory: new ChatMessageHistory([
    new SystemMessage(
      "Base on the conversation just return SIMPLE answer, not an elaborate"
    ),
  ]),
});
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

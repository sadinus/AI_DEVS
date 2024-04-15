import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { authorize, getTask, submitAnswer } from "./api";

type Task = {
  url: string;
  msg: string;
};

const { token } = await authorize("gnome");
const { url, msg } = await getTask(token);

const chat = new ChatOpenAI({
  modelName: "gpt-4-vision-preview",
  maxTokens: 1024,
});
const message = new HumanMessage({
  content: [
    {
      type: "text",
      text: msg,
    },
    {
      type: "image_url",
      image_url: {
        url,
      },
    },
  ],
});

const { content: hatColor } = await chat.invoke([message]);
submitAnswer(hatColor, token);

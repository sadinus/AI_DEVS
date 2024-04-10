import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { submitAnswer } from "./api";

const chat = new ChatOpenAI();

const blogOutlines = [
  "Wstęp: kilka słów na temat historii pizzy",
  "Niezbędne składniki na pizzę",
  "Robienie pizzy",
  "Pieczenie pizzy w piekarniku",
];

chat.invoke([
  new SystemMessage("Please write blog post for the provided outline"),
]),
  Promise.all(
    blogOutlines.map((outline) =>
      chat
        .invoke([new HumanMessage(outline)])
        .then((res) => res.lc_kwargs.content)
    )
  ).then((response) => submitAnswer(response, ""));

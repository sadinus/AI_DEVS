import { ChatOpenAI } from "@langchain/openai";
import { authorize, getTask, submitAnswer } from "./api";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { Document } from "langchain/document";

import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

type Response = {
  hint: string;
  msg: string;
};

const noIdea = "don't know";
const documents: Document[] = [];
let answer = noIdea;
let token = "";

while (answer === noIdea) {
  const { token: currentToken } = await authorize("whoami");
  token = currentToken;
  const { hint, msg: systemMessage } = await getTask<Response>(token);

  documents.unshift(new Document({ pageContent: hint }));

  const vectorStore = await MemoryVectorStore.fromDocuments(
    documents,
    new OpenAIEmbeddings()
  );

  const context = await vectorStore.similaritySearch(systemMessage, 10);
  const stringContext = context.map((doc) => doc.pageContent).join("\n");

  console.log(stringContext);

  const chat = new ChatOpenAI({
    modelName: "gpt-4",
  });

  const { content } = await chat.invoke([
    new SystemMessage(`Answer the question using the context below. The answer should be a person or if you don't know the answer, say only and exactly "${noIdea}". \n
      context###${stringContext}`),
  ]);

  answer = content.toString();
  console.log(answer);
}

submitAnswer(answer, token);

import { ChatOpenAI } from "@langchain/openai";
import { authorize, getTask, submitAnswer } from "./api";
import { SystemMessage } from "langchain/schema";
import { Document } from "langchain/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

type Response = {
  hint: string;
  msg: string;
};

const documents: Document[] = [];
let solved = false;

while (!solved) {
  const { token } = await authorize("whoami");
  const { hint, msg: systemMessage } = await getTask<Response>(token);

  documents.unshift(new Document({ pageContent: hint }));

  const vectorStore = await MemoryVectorStore.fromDocuments(
    documents,
    new OpenAIEmbeddings()
  );

  const context = await vectorStore.similaritySearch(systemMessage, 10);
  const stringContext = context.map((doc) => `- ${doc.pageContent}`).join("\n");

  console.log("person info:");
  console.log(stringContext);

  const chat = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
  });

  const { content: answer } = await chat.invoke([
    new SystemMessage(`Answer the question using the context below. The answer should be a person or if you don't know the answer, say only and exactly "don't know". \n
      context###\n${stringContext}`),
  ]);

  console.log(answer.toString());

  const isOk = await submitAnswer(answer, token);

  if (isOk.code === 0) {
    solved = true;
  }
}

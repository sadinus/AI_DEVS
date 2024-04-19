import express from "express";
import { authorize, getTask, submitAnswer } from "./api";
import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { getJson } from "serpapi";

type SearchResult = {
  title: string;
  link: string;
  snippet: string;
};

const { token } = await authorize("google");
await getTask(token);

const app = express();
app.use(express.json());

const model = new ChatOpenAI();

app.post("/", async (req, res) => {
  const { question } = req.body;
  const { content: query } = await model.invoke([
    new SystemMessage(`Simplify the question to google search:
  ###QUESTION
  ${question}`),
  ]);

  const searchResults = await searchGoogle(query.toString());
  const resultsAsText = JSON.stringify(searchResults);

  const { content } = await model.invoke([
    new SystemMessage(`Answer with link to page, based on provided data and nothing else. Do not add any content to answer.
    ### Fields:
    title - explains page title,
    link - specified the link for the resource, return this value,
    snipper - short description of page \n
  ###Data \n
  ${resultsAsText}
  ###Input
  Główna strona google
  ###Output
  https://google.com
  `),
    new HumanMessage(question),
  ]);

  const answer = {
    reply: content,
  };

  console.log(content);

  res.send(JSON.stringify(answer));
});

app.listen(3000);

// https://ngrok.com/docs/getting-started/ run ngrog from script
submitAnswer(process.env.OWN_API_URL, token);

async function searchGoogle(query: string): Promise<SearchResult[]> {
  const engine = "google";
  const url = `https://serpapi.com/search.json?engine=${engine}&q=${query}&api_key=${process.env.SERP_API_KEY}`;

  const response = await fetch(url).then((res) => res.json());

  const searchResults: SearchResult[] = response.organic_results.map(
    (result: any) => ({
      title: result.title,
      link: result.link,
      snipper: result.snippet,
    })
  );

  return searchResults;
}

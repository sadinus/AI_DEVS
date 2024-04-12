import { QdrantClient } from "@qdrant/js-client-rest";
import { authorize, getTask, submitAnswer } from "./api";
import { OpenAIEmbeddings } from "@langchain/openai";
import { v4 as uuidv4 } from "uuid";

type Response = {
  question: string;
};

const COLLECTION_NAME = "unknownNews";

const { token } = await authorize("search");
const { question } = await getTask<Response>(token);

const qdrant = new QdrantClient({ url: process.env.QDRANT_URL });
const embeddings = new OpenAIEmbeddings({ maxConcurrency: 5 });
const queryEmbedding = await embeddings.embedQuery(question);
const result = await qdrant.getCollections();
const indexed = result.collections.find(
  (collection) => collection.name === COLLECTION_NAME
);

// Create collection if not exists
if (!indexed) {
  await qdrant.createCollection(COLLECTION_NAME, {
    vectors: { size: 1536, distance: "Cosine", on_disk: true },
  });
}

const collectionInfo = await qdrant.getCollection(COLLECTION_NAME);
// Index documents if not indexed
if (!collectionInfo.points_count) {
  // Generate embeddings
  const points = [];
  const documents = await fetch(
    "https://unknow.news/archiwum_aidevs.json"
  ).then((response) => response.json());
  for (const document of documents) {
    const [embedding] = await embeddings.embedDocuments([document.title]);
    points.push({
      id: uuidv4(),
      payload: document,
      vector: embedding,
    });
  }

  // Index
  await qdrant.upsert(COLLECTION_NAME, {
    wait: true,
    batch: {
      ids: points.map((point) => point.id),
      vectors: points.map((point) => point.vector),
      payloads: points.map((point) => point.payload),
    },
  });
}

const search = await qdrant.search(COLLECTION_NAME, {
  vector: queryEmbedding,
  limit: 1,
});

console.log(search);
submitAnswer(search[0].payload!.url, token);

import OpenAI from "openai";
import { authorize, getTask, submitAnswer } from "./api";

const openai = new OpenAI();

const { token } = await authorize("whisper");
await getTask(token);

const audioFile = await fetch("https://tasks.aidevs.pl/data/mateusz.mp3");

if (audioFile) {
  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
  });

  submitAnswer(transcription.text, token);
}

import { authorize, getTask, submitAnswer } from "./api";

type Task = {
  image: string;
  text: string;
};

type Template = {
  identifier: string;
  width: number;
  height: number;
  scaleFactor: 1;
  name: string;
};

const getTemplate = async () => {
  const headers = new Headers();
  headers.append("X-API-KEY", process.env.RENDER_FORM_API_KEY!);
  headers.append("Content-Type", "application/json");

  const response = await fetch(
    "https://get.renderform.io/api/v2/my-templates",
    {
      headers: headers,
    }
  ).then((res) => res.json());

  const template = response[0] as Template;

  return template;
};

const generateMeme = async (
  imgUrl: string,
  text: string,
  template: Template
) => {
  const headers = new Headers();
  headers.append("X-API-KEY", process.env.RENDER_FORM_API_KEY!);
  headers.append("Content-Type", "application/json");

  const payload = {
    template: template.identifier,
    data: {
      "memeImage.src": imgUrl,
      "memeText.text": text,
    },
  };

  const response = await fetch("https://get.renderform.io/api/v2/render", {
    headers,
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());

  const memeUrl = response.href;
  return memeUrl;
};

const { token } = await authorize("meme");
const { image, text } = await getTask<Task>(token);

const template = await getTemplate();
const memeUrl = await generateMeme(image, text, template);

console.log(memeUrl);

submitAnswer(memeUrl, token);

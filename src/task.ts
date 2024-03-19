import { authorize, getTask } from "./api";

const { token } = await authorize("");
getTask(token);

import { authorize, getTask } from "./api";

// Uzupełnij nazwę zadania np. authorize("helloapi")
const { token } = await authorize("");
getTask(token);

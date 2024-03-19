import { authorize, getTask } from "./api";

// Uzupełnij nazwę zadania w jako parametr np. authorize("helloapi")
const { token } = await authorize("");
getTask(token);

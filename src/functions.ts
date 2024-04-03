import { authorize, getTask, submitAnswer } from "./api";

const { token } = await authorize("functions");
await getTask(token);

const functionDefinition = {
  "name": "addUser",
  "description": "add new user to the database",
  "parameters": {
      "type": "object",
      "properties": {
          "name": {
              "type": "string",
              "description": "provide name of the user"
          },
          "surname" : {
              "type": "string",
              "description": "provide surname of the user"
          },
          "year" : {
              "type": "number",
              "description": "provide year of birth of the user"
          }
      }
  }
}

submitAnswer(functionDefinition, token);

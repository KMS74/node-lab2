
const express = require("express");
const fs = require("fs");
require("dotenv").config({ path: ".env" });

const app = express();
app.use(express.json());

const FILE_PATH = "db.json";

(function createDataBaseFileJson() {
  if (!fs.existsSync(FILE_PATH))
    fs.writeFileSync(FILE_PATH, JSON.stringify([{ id: 0 }]));
  return;
})();

let dataBaseFile = fs.readFileSync(FILE_PATH, "utf-8");
dataBaseFile = JSON.parse(dataBaseFile);
const PORT = process.env.PORT;
app.listen(PORT, (err) => {
  if (!err) return console.log(`server has started in prot ${PORT}`);
  return console.log(err);
});

app.get("/todos", (request, response) => {
  try {
    if (!request.query.query_list) throw new Error("query_list is required");
    switch (request.query.query_list) {
      case "all":
        response.status(200).send(dataBaseFile);
        break;
      case "checked":
        const checked = dataBaseFile.filter((ele) => ele.checked === true);
        response.status(200).send(checked);
        break;
      case "unchecked":
        const unchecked = dataBaseFile.filter((ele) => ele.checked === false);
        response.status(200).send(unchecked);
        break;
      default:
        response.end("please write (all or checked or unchecked)");
        break;
    }
  } catch (error) {
    response.status(400).end('error');
  }
});

app.get("/todos/:list", (request, response) => {
  try {
    if (!["all", "checked", "unchecked"].includes(request.params.list))
      throw new Error("please write (all or checked or unchecked)");
    switch (request.params.list) {
      case "all":
        response.status(200).send(dataBaseFile);
        break;
      case "checked":
        const checked = dataBaseFile.filter((ele) => ele.checked === true);
        response.status(200).send(checked);
        break;
      case "unchecked":
        const unchecked = dataBaseFile.filter((ele) => ele.checked === false);
        response.status(200).send(unchecked);
        break;
      default:
        response.end("please write (all or checked or unchecked)");
        break;
    }
  } catch (error) {
    response.status(400).end('error');
  }
});

app.post("/todos", (request, response) => {
  try {
    if (!request.body.title || !request.body.body)
      throw new Error("title and body are required");
    let id = dataBaseFile[dataBaseFile.length - 1].id + 1;
    let newData = { id, ...request.body, checked: false };
    dataBaseFile.push(newData);
    fs.writeFileSync(FILE_PATH, JSON.stringify(dataBaseFile));
    response.status(201).end("created");
  } catch (error) {
    throw new Error(error);
  }
});

app.put("/todos/:id", (request, response) => {
  try {
    if (!request.body.title || !request.body.body)
      throw new Error("title and body are required");
    let id = request.params.id;
    dataBaseFile = dataBaseFile.filter((element) => {
      if (element.id == id) {
        element.title = request.body.title;
        element.body = request.body.body;
        return element;
      }
      return element;
    });
    fs.writeFileSync(FILE_PATH, JSON.stringify(dataBaseFile));
    response.status(201).end("updated");
  } catch (error) {
    response.status(400).end('error');
  }
});

app.delete("/todos/:id", (request, response) => {
  try {
    let id = request.params.id;
    if (!/\d+/.test(id)) throw new Error("id is required number");
    newDataAfterDeleted = dataBaseFile.filter((element) => element.id != id);
    fs.writeFileSync(FILE_PATH, JSON.stringify(newDataAfterDeleted));
    response.status(200).end("deleted");
  } catch (error) {
    response.status(400).end('error');
  }
});

app.put("/todos/check/:id", (request, response) => {
  try {
    let id = request.params.id;
    if (!/\d+/.test(id)) throw new Error("id is required number");
    dataBaseFile = dataBaseFile.filter((element) => {
      if (element.id == id) {
        element.checked = true;
        return element;
      }
      return element;
    });
    fs.writeFileSync(FILE_PATH, JSON.stringify(dataBaseFile));
    response.status(201).end("true");
  } catch (error) {
    response.status(400).end('error');
  }
});

app.put("/todos/uncheck/:id", (request, response) => {
  try {
    let id = request.params.id;
    if (!/\d+/.test(id)) throw new Error("id is required number");
    dataBaseFile = dataBaseFile.filter((element) => {
      if (element.id == id) {
        element.checked = false;
        return element;
      }
      return element;
    });
    fs.writeFileSync(FILE_PATH, JSON.stringify(dataBaseFile));
    response.status(201).end("true");
  } catch (error) {
    response.status(400).end('error');
  }
});

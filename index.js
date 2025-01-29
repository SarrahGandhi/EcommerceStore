const express = require("express");
const path = require("path");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const request = require("http");
const { title } = require("process");
//mongo connection
const dburl = "mongodb://localhost:27017/testdatabase";
const client = new MongoClient(dburl);

// Express APP Set up
const port = process.env.PORT || "8888";

app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));
app.get("/", async (request, response) => {
  let links = await getlinks();
  response.render("index", { title: "Home", menu: links });

  //   response.status(200).send("Test");
});

app.get("/shop", async (request, response) => {
  let links = await getlinks();
  response.render("shop", { title: "Shop", menu: links });
});

app.get("/admin/menu", async (request, response) => {
  let links = await getlinks();
  response.render("menu-list", { title: "Menu List", menu: links });
});
app.get("/admin/menu/add", async (request, response) => {
  let links = await getlinks();
  response.render("menu-add", { title: "Add Menu", menu: links });
});
app.get("/admin/menu/delete", async (request, response) => {
  await deleteLink(request.query.id);
  response.redirect("/admin/menu");
});
app.get("/admin/menu/edit", async (request, response) => {
  if (request.query.id) {
    let linktoedit = await getSingleLink(request.query.id);
    let links = await getlinks();
    response.render("menu-edit", {
      title: "Edit Menu",
      menu: links,
      linktoedit: linktoedit,
    });
  } else {
    response.redirect("/admin/menu");
  }
});

app.get("/about", (request, response) => {
  response.render("about", { title: "About" });
});
app.get("/contact", (request, response) => {
  response.render("contact", { title: "Contact" });
});
app.post("/admin/menu/add/submit", async (request, response) => {
  let newLink = {
    weight: request.body.weight,
    path: request.body.path,
    name: request.body.name,
  };
  await addLink(newLink);
  response.redirect("/admin/menu");
});
app.post("/admin/menu/edit/submit", async (request, response) => {
  let idFilter = { _id: ObjectId(request.body.linkId) };
  let updatedLink = {
    weight: request.body.weight,
    path: request.body.path,
    name: request.body.name,
  };
  await editLink(idFilter, updatedLink);
  response.redirect("/admin/menu");
});
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

// MongoDB Connection
async function connection() {
  db = client.db("testdatabase");
  await client.connect();
  console.log("Connected to MongoDB");
  return db;
}
async function getlinks() {
  db = await connection();
  let result = db.collection("menuLinks").find({});
  let resultArray = await result.toArray();
  return resultArray;
}
async function addLink(link) {
  db = await connection();
  let status = await db.collection("menulinks").insertOne(link);
  console.log("Link added");
}
async function deleteLink(id) {
  db = await connection();
  let query = { _id: ObjectId(id) };
  let result = await db.collection("menuLinks").deleteOne(query);
  console.log("Link deleted");
}
async function getSingleLink(id) {
  db = await connection();
  const editId = { _id: ObjectId(id) };
  const result = await db.collection("menuLinks").findOne(editId);
  return result;
}
async function editLink(filter, link) {
  db = await connection();
  const UpdateSet = {
    $set: link,
  };

  const updateResult = await db
    .collection("menuLinks")
    .updateOne(filter, UpdateSet);
  return updateResult;
}

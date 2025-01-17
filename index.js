const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || "8888";
app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.get("/", (request, response) => {
  response.render("index", { title: "Home" });

  //   response.status(200).send("Test");
});
app.get("/shop", (request, response) => {
  response.render("shop", { title: "Shop" });
});
app.get("/about", (request, response) => {
  response.render("about", { title: "About" });
});
app.get("/contact", (request, response) => {
  response.render("contact", { title: "Contact" });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

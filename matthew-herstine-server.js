import express from "express";
import Database from "better-sqlite3";
const db = new Database("app.db");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static("static"));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
    });
app.get("/", (req, res) => {
res.type("text/html").send("<html><body>Hello!</body></html>");
});
app.get("/hello", (req, res) => {
    res.type("text/plain").send("Hello!");
});
app.get("/goodbye", (req, res) => {
    res.type("text/plain").send("Goodbye!");
});
app.get("/hello/:name", (req, res) => {
    const name = req.params.name;
    res.type("text/plain").send(`Hello, ${name}!`);
});
app.get("/birthday", (req, res) => {
    res.type("text/plain").send("Happy Birthday!");
});
app.get("/birthday/:name", (req, res) => {
    const name = req.params.name;
    res.type("text/plain").send(`Happy Birthday, ${name}!`);
});
app.get("/api/items", (req, res) => {
    try {
    const items = db
    .prepare("SELECT id, name, notes FROM items ORDER BY id")
    .all();
    res.json(items);
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
    }
});
app.get("/api/items/:id", (req, res) => {
    const id = req.params.id;
    try {
    const item = db
    .prepare("SELECT id, name, notes FROM items WHERE id = ?")
    .get(id);
    if (!item) {
    return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
    }
});
app.listen(PORT, () => {
console.log(`Simple Express server listening on
http://localhost:${PORT}`);
});
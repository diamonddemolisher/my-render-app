import express from "express";
import Database from "better-sqlite3";
const db = new Database("app.db");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static("static"));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
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
app.post("/api/items", (req, res) => {
    const { name, notes } = req.body;
    if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "name is required" });
    }
    const notesValue = notes ?? "";
    if (typeof notesValue !== "string") {
    return res.status(400).json({ error: "notes must be a string" });
    }
    try {
    const result = db
    .prepare("INSERT INTO items (name, notes) VALUES (?, ?)")
    .run(name, notesValue);
    res.status(201).json({
    id: result.lastInsertRowid,
    name: name,
    notes: notesValue
    });
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
    }
});
app.put("/api/items/:id", (req, res) => {
    const id = req.params.id;
    const { name, notes } = req.body;
    if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "name is required" });
    }
    const notesValue = notes ?? "";
    if (typeof notesValue !== "string") {
    return res.status(400).json({ error: "notes must be a string" });
    }
    try {
    const result = db
    .prepare("UPDATE items SET name = ?, notes = ? WHERE id = ?")
    .run(name, notesValue, id);
    if (result.changes === 0) {
        return res.status(404).json({ error: "Item not found" });
        }
        res.json({ id: Number(id), name: name, notes: notesValue });
        } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.delete("/api/items/:id", (req, res) => {
    const id = req.params.id;
    try {
    const result = db
    .prepare("DELETE FROM items WHERE id = ?")
    .run(id);
    if (result.changes === 0) {
    return res.status(404).json({ error: "Item not found" });
    }
    res.status(204).send();
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
    }
});
app.get("/items", (req, res) => {
    try {
      const items = db
        .prepare("SELECT id, name, notes FROM items ORDER BY id")
        .all();
      
      // This looks for 'items-list.ejs' in your 'views' folder
      res.render("items-list", { items: items });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
});
app.get("/items/create", (req, res) => {
    res.render("items-create");
});
app.post("/items/create", (req, res) => {
    const { name, notes } = req.body;
    if (!name || typeof name !== "string") {
    return res.status(400).send("Name is required");
    }
    const notesValue = notes ?? "";
    if (typeof notesValue !== "string") {
    return res.status(400).send("Notes must be a string");
    }
    try {
    db.prepare("INSERT INTO items (name, notes) VALUES (?, ?)")
    .run(name, notesValue);
    res.redirect("/items");
    } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
    }
});    
app.get("/items/delete/:id", (req, res) => {
    const id = req.params.id;
    try {
    const result = db
    .prepare("DELETE FROM items WHERE id = ?")
    .run(id);
    if (result.changes === 0) {
    return res.status(404).send("Item not found");
    }
    res.redirect("/items");
    } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
    }
});
app.get("/items/update/:id", (req, res) => {
    const id = req.params.id;
    try {
    const item = db
    .prepare("SELECT id, name, notes FROM items WHERE id = ?")
    .get(id);
    if (!item) {
    return res.status(404).send("Item not found");
    }
    res.render("items-update", { item: item });
    } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
    }
});
app.post("/items/update/:id", (req, res) => {
    const id = req.params.id;
    const { name, notes } = req.body;
    if (!name || typeof name !== "string") {
    return res.status(400).send("Name is required");
    }
    const notesValue = notes ?? "";
    if (typeof notesValue !== "string") {
    return res.status(400).send("Notes must be a string");
    }
    try {
    const result = db
    .prepare("UPDATE items SET name = ?, notes = ? WHERE id = ?")
    .run(name, notesValue, id);
    if (result.changes === 0) {
    return res.status(404).send("Item not found");
    }
    res.redirect("/items");
    } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
    }
});
app.get("/pi", (req, res) => {
    res.type("text/plain").send("pi:3.14159");
});
app.listen(PORT, () => {
console.log(`Simple Express server listening on
http://localhost:${PORT}`);
});
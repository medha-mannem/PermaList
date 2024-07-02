import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Permalist",
  password: "oatsandmoong@04",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');
app.set('views', './views');

// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Today route
app.get('/today', async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    const items = result.rows;

    res.render('today', {
      listTitle: "Today",
      listItems: items
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving items");
  }
});

// Week route
app.get('/week', async(req, res) => {
  try {
    const result = await db.query("SELECT * FROM week ORDER BY id ASC");
    const weekItems = result.rows;

    res.render('week', {
      listTitle: "This Week",
      listItems: weekItems
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving items");
  }
});

// Month route
app.get('/month', async(req, res) => {
  try {
    const result = await db.query("SELECT * FROM month ORDER BY id ASC");
    const monthItems = result.rows;

    res.render('month', {
      listTitle: "This Month",
      listItems: monthItems
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving items");
  }
});

// POST routes for adding items
app.post("/add/today", async (req, res) => {
  const item = req.body.newItem;
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/today");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding item");
  }
});

app.post("/add/week", async (req, res) => {
  const item = req.body.newItem;
  try {
    await db.query("INSERT INTO week (title) VALUES ($1)", [item]);
    res.redirect("/week");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding item");
  }
});

app.post("/add/month", async (req, res) => {
  const item = req.body.newItem;
  try {
    await db.query("INSERT INTO month (title) VALUES ($1)", [item]);
    res.redirect("/month");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding item");
  }
});

// POST routes for editing items
app.post("/edit/today", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/today");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error updating item");
  }
});

app.post("/edit/week", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  try {
    await db.query("UPDATE week SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/week");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error updating item");
  }
});

app.post("/edit/month", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  try {
    await db.query("UPDATE month SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/month");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error updating item");
  }
});

// POST routes for deleting items
app.post("/delete/today", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/today");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting item");
  }
});

app.post("/delete/week", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM week WHERE id = $1", [id]);
    res.redirect("/week");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting item");
  }
});

app.post("/delete/month", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM month WHERE id = $1", [id]);
    res.redirect("/month");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting item");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

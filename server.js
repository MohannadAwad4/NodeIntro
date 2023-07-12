const express = require("express");
const app = express();
const port = 9000;
const { query } = require('./bookbase');
//const books=require("./books");


app.use((req, res, next) => {
    res.on("finish", () => {
        // the 'finish' event will be emitted when the response is handed over to the OS
        console.log(`Request: ${req.method} ${req.originalUrl} ${res.statusCode}`);
      });
    next();
  });
  
  app.use(express.json()) // this allows us to send JSON formatted bodies in our requests
  

app.get("/", (req, res) => {
  res.send("Welcome to the Job Application Tracker API!");
});



// List all books
app.get("/books", async (req, res) => {
  try {
    const allBooks = await query("SELECT * FROM job_applications");

    res.status(200).json(allBooks.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
  
  
  // Get a specific job
  app.patch("/books/:id", async (req, res) => {
    const bookId = parseInt(req.params.id, 10);
  
    const fieldNames = [
      "title",
      "author",
      "gebre",
      "quantity",
      
      "id",
    ].filter((name) => req.body[name]);
  
    let updatedValues = fieldNames.map(name => req.body[name]);
    const setValuesSQL = fieldNames.map((name, i) => {
      return `${name} = $${i + 1}`
    }).join(', ');
  
    try {
      const updatedBook = await query(
        `UPDATE job_applications SET ${setValuesSQL} WHERE id = $${fieldNames.length+1} RETURNING *`,
        [...updatedValues, bookId]
      );
  
      if (updatedBook.rows.length > 0) {
        res.status(200).json(updatedBook.rows[0]);
      } else {
        res.status(404).send({ message: "Book not found" });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
      console.error(err);
    }
  });
  function getNextIdFromCollection(collection) {
    if(collection.length === 0) return 1; 
    const lastRecord = collection[collection.length - 1];
    return lastRecord.id + 1;
  }
  // ...
  app.post("/books", async (req, res) => {
    const { id, title, author, genre, quantity } = req.body;
  
    try {
      const newBook = await query(
        "INSERT INTO job_applications (id, title, author, genre, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [id, title, author, genre, quantity]
      );
  
      res.status(201).json(newBook.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
 
  
 // Update a specific job
app.patch("/books/:id", (req, res) => {
    const jobId = parseInt(req.params.id, 10);
    const jobUpdates = req.body;
    const jobIndex = books.findIndex((job) => job.id === jobId);
    const updatedJob = { ...books[jobIndex], ...jobUpdates };
    if (jobIndex !== -1) {
      books[jobIndex] = updatedJob;
      res.send(updatedJob);
    } else {
      res.status(404).send({ message: "Job not found" });
    }
  });
  
  
 // Delete a specific job
 app.delete("/books/:id", async (req, res) => {
  const bookId = parseInt(req.params.id, 10);

  try {
    const deleteOp = await query("DELETE FROM job_applications WHERE id = $1", [bookId]);

    if (deleteOp.rowCount > 0) {
      res.status(200).send({ message: "book deleted successfully" });
    } else {
      res.status(404).send({ message: "book not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
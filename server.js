const express = require("express");
const app = express();
const port = 4000;


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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// List all jobs
app.get("/jobs", (req, res) => {
    // This will eventually return a list of all jobs
    req.send(jobs);
  });
  
  // Get a specific job
  // Get a specific job
app.get("/jobs/:id", (req, res) => {
    const jobId = parseInt(req.params.id);
    const job = jobs.find((job) => job.id === jobId);
    if (job) {
      res.send(job);
    } else {
      res.status(404).send({ message: "Job not found" });
    }
  });
  function getNextIdFromCollection(collection) {
    if(collection.length === 0) return 1; 
    const lastRecord = collection[collection.length - 1];
    return lastRecord.id + 1;
  }
  // ...
  app.post("/jobs", (req, res) => {
    // This will eventually create a new job
    const newJob = {
      ...req.body,
      id: getNextIdFromCollection(jobs)
    };
    console.log("newJob", newJob);
    jobs.push(newJob);
    res.send(newJob);
  }); 
  
 
  
 // Update a specific job
app.patch("/jobs/:id", (req, res) => {
    const jobId = parseInt(req.params.id, 10);
    const jobUpdates = req.body;
    const jobIndex = jobs.findIndex((job) => job.id === jobId);
    const updatedJob = { ...jobs[jobIndex], ...jobUpdates };
    if (jobIndex !== -1) {
      jobs[jobIndex] = updatedJob;
      res.send(updatedJob);
    } else {
      res.status(404).send({ message: "Job not found" });
    }
  });
  
  
 // Delete a specific job
app.delete("/jobs/:id", (req, res) => {
    const jobId = parseInt(req.params.id, 10);
    const jobIndex = jobs.findIndex((job) => job.id === jobId);
    if (jobIndex !== -1) {
      jobs.splice(jobIndex, 1);
      res.status(204).send();
    } else {
      res.status(404).send({ message: "Job not found" });
    }
  });
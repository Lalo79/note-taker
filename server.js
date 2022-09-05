const express = require('express');
var uniqid = require('uniqid'); 

const fs = require('fs');
const util = require('util');


const PORT = process.env.port || 3001;

// Request external files
let db = require('./db/db.json')

// Instantiate express in variable app
const app = express();

// Define Public Folder as Static
app.use(express.static('public'));


// Define function to write JSON file
const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// ------------ HTML Routes -------------
app.get('/api/notes', (req, res) => res.json(db));
app.get('/notes', (rq,res) => {res.sendFile(__dirname + '/public/notes.html')})


// HTML route - Adss new Note 
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body

    if (req.body ) {
        const newNote = {
            id: uniqid(),
            title,
            text
        }

        db.push(newNote);
        writeToFile('./db/db.json',db)
        res.json('Note Added Succesfully');     
    
    } else {
        res.error('Could not add new Note');
    }
})


// HTML route - Delete selected Note
app.delete(`/api/notes/:id`, (req, res) => {

    const deleteId = req.params.id;

    db = db.filter((note) => note.id != deleteId)
    writeToFile('./db/db.json',db)
    res.json('Note Added Succesfully');

})


app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT} ...`));

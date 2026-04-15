require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.json()); //JSON API

const PORT = process.env.PORT;
const path = require('path');

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Import the database connection pool
const itemsPool = require('./dbconfig');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.set('views', './views');

// Initialize the database and create the tasks table if it doesn't exist
async function initDB() {
    try {
        await itemsPool.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                task TEXT,
                completed BOOLEAN DEFAULT false
            );
        `);
        console.log("Table ready");
    } catch (err) {
        console.error("Error creating table:", err);
    }
}

initDB();

app.listen(PORT,() => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

app.post('/tasks', async(req, res) => {
    try{
        const newTask = await itemsPool.query(
            'INSERT INTO tasks (task) VALUES ($1) RETURNING *',
            [req.body.task]
        );
        res.redirect('/'); // Redirect to the main page after adding a task
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
});

app.post('/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id;

        await itemsPool.query(
            'DELETE FROM tasks WHERE id = $1',
            [id]
        );

        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT;
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const tasks = [
        {
            id:1,
            task: "Buy groceries",
            completed: false
        },
        {
            id:2,
            task: "Read a book",
            completed: false
        }
    ];
app.set('view engine', 'ejs');

app.set('views', './views');

app.get('/', (req, res) => {
    res.render('tasks', { tasks });
});

app.listen(PORT,() => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

app.post('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        console.log(`Task with ID ${taskId} has been updated.`);
    } else {
        return res.status(404).send('Task not found');
    }
    console.log(res.body);
    res.redirect('/');
});
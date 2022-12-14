const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const PORT = process.env.PORT || 5000;
const path = require('path'); //join directory paths together

//middleware
app.use(cors()); //allows the front end to communicate with the back end
app.use(express.json()); //allows us to access the req.body

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
}

//ROUTES:

//get all todos
app.get('/todos', async (req, res) => {
    try {
        const allTodos = await pool.query('SELECT * FROM todo');
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//get a todo
app.get('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await pool.query('SELECT * FROM todo WHERE todo_id = $1', [id]);
        res.json(todo.rows[0]);
    } catch(err) {
        console.error(err.message);
    }
});

//create a todo
app.post('/todos', async (req, res) => {
   try {
       const { description } = req.body;
       const newTodo = await pool.query('INSERT INTO todo (description) VALUES ($1) RETURNING *', [description]);

       res.json('Todo was updated');
   } catch(err) {
       console.error(err.message);
   }
});

//update a todo
app.put('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updateTodo = await pool.query('UPDATE todo SET description = $1 WHERE todo_id = $2', [description, id]);
        res.json(updateTodo.rows);
    } catch {
        console.error(err.message);
    }
});

//delete a todo
app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query('DELETE FROM todo WHERE todo_id = $1', [id]);
        res.json('Todo was deleted.');
    } catch(err) {
        console.error(err.message);
    }
});

//redirect all other routes to the homepage:
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
})

app.listen(PORT, () => {
    console.log(`Server is starting on port ${PORT}.`);
});
import expess from 'express';
import mysql from 'mysql'
import cors from 'cors'
const PORT = 5000;


const app = expess();
app.use(cors())
app.use(expess.json())

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "credentials"
})

app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    const INSERT_USER_QUERY = `INSERT INTO register (username, email, password) VALUES (?, ?, ?)`;

    db.query(INSERT_USER_QUERY, [username, email, password], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error signing up');
        } else {
            res.status(200).send('User signed up successfully');
        }
    });
});

app.post('/login', (req, res) => {
    const { usernameOrEmail, password } = req.body;
    const SELECT_USER_QUERY = `SELECT * FROM register WHERE (username = ? OR email = ?) AND password = ?`;

    db.query(SELECT_USER_QUERY, [usernameOrEmail, usernameOrEmail, password], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error logging in');
        } else {
            if (results.length > 0) {
                // User found, login successful
                res.status(200).send('Login successful');
            } else {
                // User not found or invalid credentials
                res.status(401).send('Invalid username/email or password');
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`App listening on port http://localhost:${PORT}`);
    db.connect((err) => {
        if (err) {
            console.error('Database connection error:', err);
        } else {
            console.log('Database connection successful');
        }
    });
});


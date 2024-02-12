import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Mysql@123",
    database: "credentials"
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connection successful');
    }
});

app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    const INSERT_USER_QUERY = `INSERT INTO login (username, email, password) VALUES (?, ?, ?)`;

    db.query(INSERT_USER_QUERY, [username, email, password], (err, result) => {
        if (err) {
            console.error('Error signing up:', err);
            return res.status(500).send('Error signing up');
        }
        res.status(200).send('User signed up successfully');
    });
});

app.post('/login', (req, res) => {
    const { usernameOrEmail, password } = req.body;
    const SELECT_USER_QUERY = `SELECT * FROM login WHERE (username = ? OR email = ?) AND password = ?`;

    db.query(SELECT_USER_QUERY, [usernameOrEmail, usernameOrEmail, password], (err, results) => {
        if (err) {
            console.error('Error logging in:', err);
            return res.status(500).send('Error logging in');
        }

        if (results.length > 0) {
            const user = results[0];
            const token = jwt.sign({ userId: user.id }, 'your_secret_key'); // Change 'your_secret_key' to your actual secret key
            res.status(200).json({ token });
        } else {
            res.status(401).send('Invalid username/email or password');
        }
    });
});

app.listen(PORT, () => {
    console.log(`App listening on port http://localhost:${PORT}`);
});


// import expess from 'express';
// import mysql from 'mysql'
// import cors from 'cors'
// import jwt from 'jsonwebtoken';
// const PORT = 5000;


// const app = expess();
// app.use(cors())
// app.use(expess.json())

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "Mysql@123",
//     database: "credentials"
// })

// app.post('/signup', (req, res) => {
//     const { username, email, password } = req.body;
//     const INSERT_USER_QUERY = `INSERT INTO login (username, email, password) VALUES (?, ?, ?)`;

//     // Insert user data into the database
//     db.query(INSERT_USER_QUERY, [username, email, password], (err, result) => {
//         if (err) {
//             console.error('Error signing up:', err);
//             return res.status(500).send('Error signing up');
//         }
        
//         // Successful signup
//         res.status(200).send('User signed up successfully');
//     });
// });



// // Modify your login endpoint to generate a token upon successful login
// app.post('/login', (req, res) => {
//     const { usernameOrEmail, password } = req.body;
//     const SELECT_USER_QUERY = `SELECT * FROM register WHERE (username = ? OR email = ?) AND password = ?`;

//     db.query(SELECT_USER_QUERY, [usernameOrEmail, usernameOrEmail, password], (err, results) => {
//         if (err) {
//             console.error(err);
//             res.status(500).send('Error logging in');
//         } else {
//             if (results.length > 0) {
//                 // User found, login successful
//                 const user = results[0];
//                 const token = jwt.sign({ userId: user.id }, 'your_secret_key'); // Change 'your_secret_key' to your actual secret key
//                 res.status(200).json({ token });
//             } else {
//                 // User not found or invalid credentials
//                 res.status(401).send('Invalid username/email or password');
//             }
//         }
//     });
// });

// app.listen(PORT, () => {
//     console.log(`App listening on port http://localhost:${PORT}`);
//     db.connect((err) => {
//         if (err) {
//             console.error('Database connection error:', err);
//         } else {
//             console.log('Database connection successful');
//         }
//     });
// });


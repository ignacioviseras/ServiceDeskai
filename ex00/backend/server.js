const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());// to use frontend
app.use(express.json());// allow serv to use json

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- MongoDB connected ---');
    } catch (error) {
        console.error(`Database connection error: ${error.message}`);
        process.exit(1);
    }
};

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Backend!' });
});

//firts conect the db and if the connection si okey start the serv
connectDB().then(() => {
    app.listen(PORT, () =>
        console.log(`Express server running on port ${PORT}`)
    );
});

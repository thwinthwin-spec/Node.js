const express = require('express');
const app = express();

app.use(express.json());

let list = [
    { name: "Mg Mg", age: 20, salary: 1899, isSingle: true },
    { name: "Aung", age: 22, salary: 2500, isSingle: false },
    { name: "Kyaw Kyaw", age: 29, salary: 2600, isSingle: true },
    { name: "Myo Myo", age: 25, salary: 1900, isSingle: false },
    { name: "Mya Mya", age: 30, salary: 3099, isSingle: false }
];

app.get('/', (req, res) => {
    res.send("Welcome from server");
});



app.get('/list', (req, res) => {
    res.send(list);  // ✅ Use res.json for JSON response
});






app.listen(8000, () => {
    console.log("Server Running On http://localhost:8000");
});

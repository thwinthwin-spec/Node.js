// const express = require("express");
// const path = require("path");
// const db = require("./db");

// const app = express();

// // Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.static("public"));


// // -------------------- PAGES --------------------

// // Register page
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "register.html"));
// });

// // Login page
// app.get("/login", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "login.html"));
// });

// // Add student page
// app.get("/student", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "addstudent.html"));
// });

// // Dashboard page
// app.get("/dashboard", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "dashboard.html"));
// });

// // Edit page
// app.get("/edit-student/:id", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "editstudent.html"));
// });


// // -register-
// app.post("/register", (req, res) => {

//     const { username, password } = req.body;

//     const sql =
//     "INSERT INTO users(username,password) VALUES(?,?)";

//     db.query(sql, [username, password], (err) => {

//         if (err) {
//             console.log(err);
//             return res.send("Register Failed");
//         }

//         res.send(`
//             <h1>Register Success</h1>
//             <a href="/login">Go Login</a>
//         `);

//     });

// });












// // -login-
// app.post("/login", (req, res) => {

//     const { username, password } = req.body;

//     const sql =
//     "SELECT * FROM users WHERE username=? AND password=?";

//     db.query(sql, [username, password], (err, result) => {

//         if (err) {
//             console.log(err);
//             return res.send("Login Error");
//         }

//         if (result.length > 0) {
//             return res.redirect("/dashboard");
//         }

//         res.send(`
//             <h1>Wrong Username or Password</h1>
//             <a href="/login">Try Again</a>
//         `);

//     });

// });




























// // -create-
// app.post("/add-student", (req, res) => {

//     const { name, age, grade } = req.body;

//     const sql =
//     "INSERT INTO students(name,age,grade) VALUES(?,?,?)";

//     db.query(sql, [name, age, grade], (err) => {

//         if (err) {
//             console.log(err);
//             return res.send("Add Student Failed");
//         }

//         res.redirect("/dashboard");

//     });

// });






















// // -read all -
// app.get("/students", (req, res) => {

//     const sql = "SELECT * FROM students";

//     db.query(sql, (err, result) => {

//         if (err) {
//             console.log(err);
//             return res.json([]);
//         }

//         res.json(result);

//     });

// });














// // -read one-

// app.get("/student/:id", (req, res) => {

//     const id = req.params.id;

//     const sql =
//     "SELECT * FROM students WHERE id=?";

//     db.query(sql, [id], (err, result) => {

//         if (err) {
//             console.log(err);
//             return res.json({});
//         }

//         res.json(result[0]);

//     });

// });




// // -update-



// app.post("/update-student/:id", (req, res) => {

//     const id = req.params.id;

//     const { name, age, grade } = req.body;

//     const sql =
//     "UPDATE students SET name=?, age=?, grade=? WHERE id=?";

//     db.query(sql, [name, age, grade, id], (err) => {

//         if (err) {
//             console.log(err);
//             return res.send("Update Failed");
//         }

//         res.redirect("/dashboard");

//     });

// });
















// // -delete-



// app.get("/delete-student/:id", (req, res) => {

//     const id = req.params.id;

//     const sql =
//     "DELETE FROM students WHERE id=?";

//     db.query(sql, [id], (err) => {

//         if (err) {
//             console.log(err);
//             return res.send("Delete Failed");
//         }

//         res.redirect("/dashboard");

//     });

// });












// // -------------------- SERVER --------------------

// app.listen(8000, () => {
//     console.log("Server Running On http://localhost:8000");
// });
const express = require("express");
const path = require("path");
const session = require("express-session");
const db = require("./db");

const app = express();

// =============================
// Middleware
// =============================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: "mysecretkey",
        resave: false,
        saveUninitialized: false
    })
);

app.use(express.static("public"));

// =============================
// Middleware Admin Check
// =============================

function isAdmin(req, res, next) {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    if (req.session.user.username !== "admin") {
        return res.send(`
            <h1>Access Denied</h1>
            <p>Admin only page.</p>
            <a href="/logout">Logout</a>
        `);
    }

    next();
}

// =============================
// Pages
// =============================

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "register.html")
    );
});

app.get("/login", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "login.html")
    );
});

app.get("/dashboard", isAdmin, (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "dashboard.html")
    );
});

app.get("/student", isAdmin, (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "addstudent.html")
    );
});

app.get("/edit-student/:id", isAdmin, (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "editstudent.html")
    );
});

// =============================
// Register
// =============================

app.post("/register", (req, res) => {

    const { username, password } = req.body;

    const sql =
        "INSERT INTO users(username,password) VALUES(?,?)";

    db.query(sql, [username, password], (err) => {

        if (err) {
            console.log(err);
            return res.send("Register Failed");
        }

        res.redirect("/login");

    });

});

// =============================
// Login
// =============================

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    const sql =
        "SELECT * FROM users WHERE username=? AND password=?";

    db.query(sql, [username, password], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Login Error");
        }

        if (result.length === 0) {
            return res.send(`
                <h1>Wrong Username Or Password</h1>
                <a href="/login">Try Again</a>
            `);
        }

        const user = result[0];

        req.session.user = {
            id: user.id,
            username: user.username
        };

        if (user.username === "admin") {
            return res.redirect("/dashboard");
        }

        res.send(`
            <h1>Welcome ${user.username}</h1>
            <p>You are normal user.</p>

            <br>

            <a href="/logout">
                Logout
            </a>
        `);

    });

});

// =============================
// Logout
// =============================

app.get("/logout", (req, res) => {

    req.session.destroy(() => {
        res.redirect("/login");
    });

});

// =============================
// Student CRUD
// =============================

// CREATE

app.post("/add-student", isAdmin, (req, res) => {

    const { name, age, grade } = req.body;

    const sql =
        "INSERT INTO students(name,age,grade) VALUES(?,?,?)";

    db.query(sql, [name, age, grade], (err) => {

        if (err) {
            console.log(err);
            return res.send("Add Failed");
        }

        res.redirect("/dashboard");

    });

});

// READ ALL

app.get("/students", isAdmin, (req, res) => {

    const sql =
        "SELECT * FROM students";

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.json([]);
        }

        res.json(result);

    });

});

// READ ONE

app.get("/student/:id", isAdmin, (req, res) => {

    const id = req.params.id;

    const sql =
        "SELECT * FROM students WHERE id=?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.log(err);
            return res.json({});
        }

        res.json(result[0]);

    });

});

// UPDATE

app.post("/update-student/:id", isAdmin, (req, res) => {

    const id = req.params.id;

    const { name, age, grade } = req.body;

    const sql =
        "UPDATE students SET name=?, age=?, grade=? WHERE id=?";

    db.query(
        sql,
        [name, age, grade, id],
        (err) => {

            if (err) {
                console.log(err);
                return res.send("Update Failed");
            }

            res.redirect("/dashboard");

        }
    );

});

// DELETE

app.get("/delete-student/:id", isAdmin, (req, res) => {

    const id = req.params.id;

    const sql =
        "DELETE FROM students WHERE id=?";

    db.query(sql, [id], (err) => {

        if (err) {
            console.log(err);
            return res.send("Delete Failed");
        }

        res.redirect("/dashboard");

    });

});

// =============================
// Server
// =============================

app.listen(8000, () => {
    console.log(
        "Server Running On http://localhost:8000"
    );
});
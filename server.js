/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Hanbo Zhang Student ID: 138092234 Date: 10/30/2024
*
********************************************************************************/



// server.js
var HTTP_PORT = process.env.PORT || 8082;
var express = require("express");
var path = require("path");
var collegeData = require("./modules/collegeData");

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

collegeData.initialize()
    .then(() => {
        //server start
        app.listen(HTTP_PORT, () => {
            console.log("Server listening on port: " + HTTP_PORT);
        });
    })
    .catch((err) => {
        console.error("Failed to initialize data:", err);
    });

app.get("/students", (req, res) => {
    const course = req.query.course;
    if (course) {
        collegeData.getStudentsByCourse(course)
            .then(students => res.json(students))
            .catch(() => res.json({ message: "no results" }));
    } else {
        collegeData.getAllStudents()
            .then(students => res.json(students))
            .catch(() => res.json({ message: "no results" }));
    }
});

app.get("/tas", (req, res) => {
    collegeData.getTAs()
        .then(TAs => res.json(TAs))
        .catch(() => res.json({ message: "no results" }));
});

app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then(courses => res.json(courses))
        .catch(() => res.json({ message: "no results" }));
});

app.get("/student/:num", (req, res) => {
    const studentNum = req.params.num;
    collegeData.getStudentsByNum(studentNum)
        .then(student => res.json(student))
        .catch(() => res.json({ message: "no results" }));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "about.html"));
});

app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "htmlDemo.html"));
});

app.get('/students/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'addStudent.html'));
});

app.post('/students/add', (req, res) => {
    collegeData.addStudent(req.body)
        .then(() => {
            res.redirect('/students'); 
        })
        .catch(err => {
            console.error("Error adding student:", err);
            res.status(500).send("Internal Server Error");
        });
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});
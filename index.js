const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");

// parse application/json
app.use(bodyParser.json());

//Create Database Connection
const conn = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "HelloWorld",
	database: "Blog",
});

// connect to database
conn.connect((err) => {
	if (err) throw err;
	console.log("MySQL connected");
});

app.post("/api/create", (req, res) => {
	let data = { title: req.body.title, blog_description: req.body.blog_description, category: req.body.category, img: req.body.img};
	let sql = "INSERT INTO blog_table SET ?";
	let query = conn.query(sql, data, (err, result) => {
		if (err) throw err;
		res.send(JSON.stringify({ status: 200, error: null, response: "New Record is Added successfully" }));
	});
});


app.get("/api/view", (req, res) => {
    let sql = "SELECT * FROM blog_table";
    if(req.query.category){
	    sql += " WHERE category = '" + req.query.category + "'";
    }else if(req.query.search){
        sql += " WHERE title = '" + req.query.search + "'";
    }
    sql += " order by blog_id"
    if(req.query.sort && (req.query.sort.toLowerCase() == 'desc' || req.query.sort.toLowerCase() == 'descending')){
        sql += " desc";
    }
	let query = conn.query(sql, (err, result) => {
		if (err) throw err;
		res.send(JSON.stringify({ status: 200, error: null, response: result }));
	});
});

app.get("/api/view/:id", (req, res) => {
    let sql = "SELECT * FROM blog_table where blog_id = " + req.params.id;
	let query = conn.query(sql, (err, result) => {
		if (err) throw err;
		res.send(JSON.stringify({ status: 200, error: null, response: result }));
	});
});


app.listen(8000, () => {
	console.log("server started on port 8000...");
});
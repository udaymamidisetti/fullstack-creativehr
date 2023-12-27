const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
var bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "php_test_mast",
});

app.listen(2000, () => {
  console.log(`Server is running on port 2000`);
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
});

app.post("/createtests", (req, res) => {
  const {
    Test_name,
    Test_type,
    tester_email_id,
    Tester_mobile_no,
    Alternative_no,
  } = req.body;
  const insertQuery = `INSERT INTO php_test_mast(Test_name, Test_type, tester_email_id, Tester_mobile_no, Alternative_no,Creation_Date, Last_Updation_Date) VALUES ('${Test_name}','${Test_type}','${tester_email_id}','${Tester_mobile_no}','${Alternative_no}',NOW(),NOW())`;
  connection.query(insertQuery, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
      return;
    }
    res
      .status(200)
      .json({ res: 1, message: "Test added successfull", data: results });
  });
});

app.get("/getAllValues", (req, res) => {
  connection.query("SELECT * FROM php_test_mast", (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.status(200).json(results);
  });
});
app.get("/gettests", (req, res) => {
  connection.query("SELECT * FROM test_type", (err, result) => {
    if (err) {
      res.status(500).send("Internal server error");
      return;
    }
    res.status(200).json(result);
  });
});
app.post("/createtest", (req, res) => {
  const { test_type } = req.body;
  connection.query(
    `SELECT * FROM test_type WHERE test_type = '${test_type}'`,
    (selectErr, selectResult) => {
      if (selectErr) {
        res.status(500).send("Internal Server Error");
        return;
      }
      if (selectResult.length > 0) {
        res.status(200).json({ res: 1, message: "Test type already exists" });
        return;
      } else {
        connection.query(
          `INSERT INTO test_type(test_type) VALUES('${test_type}')`,
          (err, result) => {
            if (err) {
              res.status(500).send("Internal Server Error");
              return;
            }
            res
              .status(200)
              .json({ res: 0, message: "Test created successfull" });
          }
        );
      }
    }
  );
});

app.delete("/deletetest/:test_id", (req, res) => {
  const testId = req.params.test_id;
  connection.query(
    `DELETE FROM php_test_mast WHERE test_id = ${testId}`,
    (err, result) => {
      if (err) {
        res.status(500).send("Internal Server Error");
        return;
      }
      res.status(200).json({ res: 1, message: "Test deleted successfully" });
    }
  );
});

app.put("/updatetest/:test_id", (req, res) => {
  const testId = req.params.test_id;
  const {
    Test_name,
    Test_type,
    tester_email_id,
    Tester_mobile_no,
    Alternative_no,
  } = req.body;
  const updateQuery = `UPDATE php_test_mast SET 
      Test_name = '${Test_name}', 
      Test_type = '${Test_type}', 
      tester_email_id = '${tester_email_id}', 
      Tester_mobile_no = '${Tester_mobile_no}', 
      Alternative_no = '${Alternative_no}',
      Last_Updation_Date = NOW()
      WHERE test_id = ${testId}`;

  connection.query(updateQuery, (err, result) => {
    if (err) {
      res.status(500).send("Internal Server Error");
      return;
    }
    res
      .status(200)
      .json({ res: 1, message: "Test updated successfully", data: result });
  });
});

app.get("/getAllValues/:test_id", (req, res) => {
  const test_id = req.params.test_id;
  connection.query(
    `SELECT * FROM php_test_mast WHERE test_id = ${test_id}`,
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
        return;
      }
      console.log(results);
      res.status(200).json(results);
    }
  );
});

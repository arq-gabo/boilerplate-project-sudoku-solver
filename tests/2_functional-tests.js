const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("/api/solve", () => {
    test("1.- Solve a puzzle with valid puzzle string: POST request to /api/solve", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle:
            ".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(
            res.body.solution,
            "473891265851726394926345817568913472342687951197254638734162589685479123219538746"
          );
          done();
        });
    });

    test("2.- Solve a puzzle with missing puzzle string: POST request to /api/solve", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle: "",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });

    test("3.- Solve a puzzle with invalid characters: POST request to /api/solve", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle:
            "invalidCharaterInThePuzzle.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.6387",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("4.- Solve a puzzle with incorrect length: POST request to /api/solve", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle: "7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.6387",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);

          assert.equal(res.type, "application/json");
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("5.- Solve a puzzle that cannot be solved: POST request to /api/solve", function (done) {
      chai
        .request(server)
        .post("/api/solve")
        .send({
          puzzle:
            "87.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });
  });

  suite("/api/check", () => {
    let globalPuzzle =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    test("6.- Check a puzzle placement with all fields: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: globalPuzzle,
          coordinate: "E5",
          value: "4",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.valid, true);
          done();
        });
    });

    test("7.- Check a puzzle placement with single placement conflict: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: globalPuzzle,
          coordinate: "B5",
          value: "6",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.valid, false);
          assert.isArray(
            res.body.conflict,
            "The property 'conflict' is an array"
          );
          assert.equal(res.body.conflict[0], "column");
          done();
        });
    });

    test("8.- Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: globalPuzzle,
          coordinate: "H2",
          value: "3",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.valid, false);
          assert.isArray(
            res.body.conflict,
            "The property 'conflict' is an array"
          );
          assert.equal(res.body.conflict[0], "row");
          assert.equal(res.body.conflict[1], "column");
          done();
        });
    });

    test("9.- Check a puzzle placement with all placement conflicts: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: globalPuzzle,
          coordinate: "B6",
          value: "4",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.valid, false);
          assert.isArray(
            res.body.conflict,
            "The property 'conflict' is an array"
          );
          assert.equal(res.body.conflict[0], "row");
          assert.equal(res.body.conflict[1], "column");
          assert.equal(res.body.conflict[2], "region");
          done();
        });
    });

    test("10.- Check a puzzle placement with missing required fields: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: "",
          coordinate: "A1",
          value: "1",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "Required field(s) missing");
          done();
        });
    });

    test("11.- Check a puzzle placement with invalid characters: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle:
            "invalidCharaterInThePuzzle.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.6387",
          coordinate: "A1",
          value: "1",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("12.- Check a puzzle placement with incorrect length: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: "7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.6387",
          coordinate: "A1",
          value: "1",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("13.- Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: globalPuzzle,
          coordinate: "Z0",
          value: "1",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });

    test("14.- Check a puzzle placement with invalid placement value: POST request to /api/check", function (done) {
      chai
        .request(server)
        .post("/api/check")
        .send({
          puzzle: globalPuzzle,
          coordinate: "A1",
          value: "0",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });
  });
});

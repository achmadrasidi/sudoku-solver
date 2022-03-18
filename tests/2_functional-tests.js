const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("Routing Tests", () => {
    suite("POST /api/solve => solve puzzle", () => {
      test("Solve a puzzle with valid puzzle string", (done) => {
        chai
          .request(server)
          .post("/api/solve")
          .send({ puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37." })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body.solution, "135762984946381257728459613694517832812936745357824196473298561581673429269145378");
              done();
            }
          });
      });

      test("Solve a puzzle with missing puzzle string", (done) => {
        chai
          .request(server)
          .post("/api/solve")
          .send({ puzzle: "" })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "Required field missing");
              done();
            }
          });
      });

      test("Solve a puzzle with invalid characters", (done) => {
        chai
          .request(server)
          .post("/api/solve")
          .send({ puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....asdasd.37." })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "Invalid characters in puzzle");
              done();
            }
          });
      });

      test("Solve a puzzle with incorrect length", (done) => {
        chai
          .request(server)
          .post("/api/solve")
          .send({ puzzle: "a" })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
              done();
            }
          });
      });

      test("Solve a puzzle that cannot be solved", (done) => {
        chai
          .request(server)
          .post("/api/solve")
          .send({ puzzle: "135762984946381257728459613694517832812936745357824196473298561581673429269145378" })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "Puzzle cannot be solved");
              done();
            }
          });
      });
    });

    suite("POST /api/check => check puzzle", () => {
      test("Check a puzzle placement with all fields", (done) => {
        chai
          .request(server)
          .post("/api/check")
          .send({
            puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
            coordinate: "A3",
            value: 5,
          })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body.valid, true);
              done();
            }
          });
      });

      test("Check a puzzle placement with single placement conflict", (done) => {
        chai
          .request(server)
          .post("/api/check")
          .send({
            puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
            coordinate: "A1",
            value: 2,
          })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body.valid, false);
              assert.deepEqual(res.body.conflict, ["region"]);
              done();
            }
          });
      });

      test("Check a puzzle placement with multiple placement conflicts", (done) => {
        chai
          .request(server)
          .post("/api/check")
          .send({
            puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
            coordinate: "A1",
            value: 4,
          })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body.valid, false);
              assert.deepEqual(res.body.conflict, ["column", "region"]);
              done();
            }
          });
      });

      test("Check a puzzle placement with all placement conflicts", (done) => {
        chai
          .request(server)
          .post("/api/check")
          .send({
            puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
            coordinate: "A3",
            value: 4,
          })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body.valid, false);
              assert.deepEqual(res.body.conflict, ["row", "column", "region"]);
              done();
            }
          });
      });

      test("Check a puzzle placement with missing required fields", (done) => {
        chai
          .request(server)
          .post("/api/check")
          .send({
            puzzle: "",
            coordinate: "A3",
            value: 4,
          })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "Required field(s) missing");
              done();
            }
          });
      });

      test("Check a puzzle placement with invalid characters", (done) => {
        chai
          .request(server)
          .post("/api/check")
          .send({
            puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......asda....4.37.4.3..6..",
            coordinate: "A3",
            value: 4,
          })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "Invalid characters in puzzle");
              done();
            }
          });
      });

      test("Check a puzzle placement with incorrect length", (done) => {
        chai
          .request(server)
          .post("/api/check")
          .send({
            puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1234....4.37.4.3..6..asd",
            coordinate: "A3",
            value: 4,
          })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
              done();
            }
          });
      });

      test("Check a puzzle placement with invalid placement coordinate", (done) => {
        chai
          .request(server)
          .post("/api/check")
          .send({
            puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1234....4.37.4.3..6..asd",
            coordinate: "aweawe",
            value: 4,
          })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "Invalid coordinate");
              done();
            }
          });
      });

      test("Check a puzzle placement with invalid placement value", (done) => {
        chai
          .request(server)
          .post("/api/check")
          .send({
            puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1234....4.37.4.3..6..asd",
            coordinate: "A3",
            value: "awawe",
          })
          .end((err, res) => {
            if (err) {
              console.error(err);
            } else {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "Invalid value");
              done();
            }
          });
      });
    });
  });
});

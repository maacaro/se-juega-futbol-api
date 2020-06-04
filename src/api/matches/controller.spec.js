process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
const expect = require("chai").expect;
let server = require("../../server");
const Pool = require("pg").Pool;
const { connectionString } = require("../../config");

const pool = new Pool({
  connectionString: connectionString
});

chai.use(chaiHttp);

describe("POST /api/matches", () => {
  before(async () => {
    const {
      body: { token }
    } = await chai
      .request(server)
      .post("/api/user")
      .send({
        email: "manuel@sejuegafutbol.com",
        name: "Manuel",
        lastName: "Castro",
        password: "123",
        confirmPassword: "123"
      });
    await chai
      .request(server)
      .post("/api/user")
      .send({
        email: "heberth@sejuegafutbol.com",
        name: "Heberth",
        lastName: "Strube",
        password: "123",
        confirmPassword: "123"
      });
    await chai
      .request(server)
      .post("/api/user")
      .send({
        email: "javier@sejuegafutbol.com",
        name: "Javier",
        lastName: "Malpica",
        password: "123",
        confirmPassword: "123"
      });
    await chai
      .request(server)
      .post("/api/locations")
      .set("x-access-token", token)
      .send({
        name: "UCAT",
        latitude: 6,
        longitude: 4,
        address: "foo"
      });
  });
  after(async function() {
    try {
      await pool.query("TRUNCATE TABLE users CASCADE");
      await pool.query("TRUNCATE TABLE locations CASCADE");
      await pool.query("ALTER SEQUENCE users_user_id_seq RESTART WITH 1");
      await pool.query(
        "ALTER SEQUENCE locations_location_id_seq RESTART WITH 1"
      );
    } catch (error) {
      console.log(error);
    }
  });
  it("response with 401 when is no token", async () => {
    const response = await chai
      .request(server)
      .post("/api/matches")
      .send({});

    expect(response).to.have.status(401);
  });
  it("response with auth false  when is no token", async () => {
    const response = await chai
      .request(server)
      .post("/api/matches")
      .send({});

    expect(response.body.auth).to.equal(false);
  });
  it("response with 500 when the token can not be decoded", async () => {
    const response = await chai
      .request(server)
      .post("/api/matches")
      .set("x-access-token", "foo")
      .send({});

    expect(response).to.have.status(500);
  });
  it("response with `Failed to authenticate token.` message when the token can not be decoded", async () => {
    const {
      body: { message }
    } = await chai
      .request(server)
      .post("/api/matches")
      .set("x-access-token", "foo")
      .send({});

    expect(message).to.equal("Failed to authenticate token.");
  });
  it("response with 400 when there's no matchName", async () => {
    const {
      body: { token }
    } = await chai
      .request(server)
      .post("/api/login")
      .send({
        email: "manuel@sejuegafutbol.com",
        name: "Manuel",
        lastName: "Castro",
        password: "123"
      });
    const response = await chai
      .request(server)
      .post("/api/matches")
      .set("x-access-token", token)
      .send({
        matchDate: "2020-06-23",
        matchTime: "16:00:00",
        players: [1, 2, 3],
        location: 1
      });
    expect(response).to.have.status(400);
  });
  it("response with 400 when there's no matchDate", async () => {
    const {
      body: { token }
    } = await chai
      .request(server)
      .post("/api/login")
      .send({
        email: "manuel@sejuegafutbol.com",
        name: "Manuel",
        lastName: "Castro",
        password: "123"
      });
    const response = await chai
      .request(server)
      .post("/api/matches")
      .set("x-access-token", token)
      .send({
        matchName: "fist match",
        matchTime: "16:00:00",
        players: [1, 2, 3],
        location: 1
      });
    expect(response).to.have.status(400);
  });
  it("response with 400 when there's no matchTime", async () => {
    const {
      body: { token }
    } = await chai
      .request(server)
      .post("/api/login")
      .send({
        email: "manuel@sejuegafutbol.com",
        name: "Manuel",
        lastName: "Castro",
        password: "123"
      });
    const response = await chai
      .request(server)
      .post("/api/matches")
      .set("x-access-token", token)
      .send({
        matchName: "fist match",
        matchDate: "2020-06-23",
        players: [1, 2, 3],
        location: 1
      });
    expect(response).to.have.status(400);
  });
  it("response with 400 when there's no players", async () => {
    const {
      body: { token }
    } = await chai
      .request(server)
      .post("/api/login")
      .send({
        email: "manuel@sejuegafutbol.com",
        name: "Manuel",
        lastName: "Castro",
        password: "123"
      });
    const response = await chai
      .request(server)
      .post("/api/matches")
      .set("x-access-token", token)
      .send({
        matchName: "fist match",
        matchDate: "2020-06-23",
        matchTime: "16:00:00",
        location: 1
      });
    expect(response).to.have.status(400);
  });
  it("response with 400 when players is empty", async () => {
    const {
      body: { token }
    } = await chai
      .request(server)
      .post("/api/login")
      .send({
        email: "manuel@sejuegafutbol.com",
        name: "Manuel",
        lastName: "Castro",
        password: "123"
      });
    const response = await chai
      .request(server)
      .post("/api/matches")
      .set("x-access-token", token)
      .send({
        matchName: "fist match",
        matchDate: "2020-06-23",
        matchTime: "16:00:00",
        players: [],
        location: 1
      });
    expect(response).to.have.status(400);
  });
  it("response with 400 locations is missing", async () => {
    const {
      body: { token }
    } = await chai
      .request(server)
      .post("/api/login")
      .send({
        email: "manuel@sejuegafutbol.com",
        name: "Manuel",
        lastName: "Castro",
        password: "123"
      });
    const response = await chai
      .request(server)
      .post("/api/matches")
      .set("x-access-token", token)
      .send({
        matchName: "fist match",
        matchDate: "2020-06-23",
        matchTime: "16:00:00",
        players: [1, 2, 3]
      });
    expect(response).to.have.status(400);
  });
  it("response with 400 when the locations doesn`t exist", async () => {
    const {
      body: { token }
    } = await chai
      .request(server)
      .post("/api/login")
      .send({
        email: "manuel@sejuegafutbol.com",
        name: "Manuel",
        lastName: "Castro",
        password: "123"
      });
    const response = await chai
      .request(server)
      .post("/api/matches")
      .set("x-access-token", token)
      .send({
        matchName: "fist match",
        matchDate: "2020-06-23",
        matchTime: "16:00:00",
        players: [1, 2, 3],
        location: 4
      });
    expect(response).to.have.status(400);
  });
  it("response with 400 when a player doesn`t exist", async () => {
    const {
      body: { token }
    } = await chai
      .request(server)
      .post("/api/login")
      .send({
        email: "manuel@sejuegafutbol.com",
        name: "Manuel",
        lastName: "Castro",
        password: "123"
      });
    const response = await chai
      .request(server)
      .post("/api/matches")
      .set("x-access-token", token)
      .send({
        matchName: "fist match",
        matchDate: "2020-06-23",
        matchTime: "16:00:00",
        players: [1, 2, 3, 4],
        location: 1
      });
    expect(response).to.have.status(400);
  });
  // it("response with 201", async () => {
  //   const {
  //     body: { token }
  //   } = await chai
  //     .request(server)
  //     .post("/api/login")
  //     .send({
  //       email: "manuel@sejuegafutbol.com",
  //       name: "Manuel",
  //       lastName: "Castro",
  //       password: "123"
  //     });
  //   const response = await chai
  //     .request(server)
  //     .post("/api/mathes")
  //     .set("x-access-token", token)
  //     .send({
  //       matchName: "fist match",
  //       matchDate: "2020-06-23",
  //       matchTime: "16:00:00",
  //       players: [1, 2, 3],
  //       location: 1
  //     });
  //   expect(response).to.have.status(201);
  // });
});

describe("GET /api/matches", () => {
  before(async () => {
    await chai
      .request(server)
      .post("/api/user")
      .send({
        email: "manuel@sejuegafutbol.com",
        name: "Manuel",
        lastName: "Castro",
        password: "123",
        confirmPassword: "123"
      });
  });
  after(async function() {
    try {
      await pool.query("TRUNCATE TABLE matches CASCADE");
      await pool.query("ALTER SEQUENCE matches_matches_id_seq RESTART WITH 1");
      await pool.query("TRUNCATE TABLE users CASCADE");
      await pool.query("ALTER SEQUENCE users_user_id_seq RESTART WITH 1");
    } catch (error) {
      console.log(error);
    }
  });
  it("response with 401 when is no token", async () => {
    const response = await chai.request(server).get("/api/matches");

    expect(response).to.have.status(401);
  });
  it("response with auth false  when is no token", async () => {
    const response = await chai.request(server).get("/api/matches");

    expect(response.body.auth).to.equal(false);
  });
  it("response with 500 when the token can not be decoded", async () => {
    const response = await chai
      .request(server)
      .get("/api/matches")
      .set("x-access-token", "foo");

    expect(response).to.have.status(500);
  });
  it("response with `Failed to authenticate token.` message when the token can not be decoded", async () => {
    const {
      body: { message }
    } = await chai
      .request(server)
      .get("/api/matches")
      .set("x-access-token", "foo");

    expect(message).to.equal("Failed to authenticate token.");
  });
});

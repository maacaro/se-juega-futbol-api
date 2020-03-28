process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
const expect = require("chai").expect;
const Pool = require("pg").Pool;
let server = require("../../server");

const { connectionString } = require("../../config");

const pool = new Pool({
  connectionString: connectionString
});

chai.use(chaiHttp);

describe("Controler /api/user Post Request", () => {
  afterEach(async function() {
    try {
      await pool.query("TRUNCATE TABLE users CASCADE");
      await pool.query("ALTER SEQUENCE users_user_id_seq RESTART WITH 1");
    } catch (error) {
      console.log(error);
    }
  });

  it("return a 201 status code", async () => {
    const response = await chai
      .request(server)
      .post("/api/user")
      .send({
        email: "otherme@sejuegafutbol.com",
        name: "Manuel",
        lastName: "Castro",
        password: "123",
        confirmPassword: "123"
      });
    expect(response).to.have.status(201);
  });
  it("return auth: true and a valid token", async () => {
    const response = await chai
      .request(server)
      .post("/api/user")
      .send({
        email: "me@sejuegafutbol.com",
        name: "Manuel",
        lastName: "Castro",
        password: "123",
        confirmPassword: "123"
      });
    expect(response.body).to.have.property("auth");
    expect(response.body).to.have.property("token");
  });
  it("return a 409 stasus code when the email already exits", async () => {
    const response = await chai
      .request(server)
      .post("/api/user")
      .send({
        email: "me@sejuegafutbol.com",
        name: "Manuel",
        lastName: "Castro",
        password: "123",
        confirmPassword: "123"
      });
    expect(response.body).to.have.property("auth");
    expect(response.body).to.have.property("token");
    const secondResponse = await chai
      .request(server)
      .post("/api/user")
      .send({
        email: "me@sejuegafutbol.com",
        name: "Manuel",
        lastName: "Castro",
        password: "123",
        confirmPassword: "123"
      });
    expect(secondResponse).to.have.status(409);
  });
});

describe("Controller POST REQUEST /api/login", () => {
  afterEach(async function() {
    try {
      await pool.query("TRUNCATE TABLE users CASCADE");
      await pool.query("ALTER SEQUENCE users_user_id_seq RESTART WITH 1");
    } catch (error) {
      console.log(error);
    }
  });
  it("response 404 when user is not Found", async () => {
    const { status } = await chai
      .request(server)
      .post("/api/login")
      .send({
        email: "me@sejuegafutbol.com",
        password: "123"
      });

    expect(status).to.equal(404);
  });
  it("response 'User Not Found' when the user doesn't exits", async () => {
    const {
      body: { message }
    } = await chai
      .request(server)
      .post("/api/login")
      .send({
        email: "me@sejuegafutbol.com",
        password: "123"
      });

    expect(message).to.equal("User Not Found");
  });
  it("response 401 when the user and password combination is not valid'", async () => {
    const responseRegisterUser = await chai
      .request(server)
      .post("/api/user")
      .send({
        email: "me@sejuegafutbol.com",
        name: "Manuel",
        lastName: "Castro",
        password: "123",
        confirmPassword: "123"
      });

    const responseLogin = await chai
      .request(server)
      .post("/api/login")
      .send({
        email: "me@sejuegafutbol.com",
        password: "987"
      });

    expect(responseRegisterUser).to.have.status(201);
    expect(responseLogin).to.have.status(401);
  });
  it("response 200 when the user and password are valid'", async () => {
    const responseRegisterUser = await chai
      .request(server)
      .post("/api/user")
      .send({
        email: "me@sejuegafutbol.com",
        name: "Manuel",
        lastName: "Castro",
        password: "123",
        confirmPassword: "123"
      });

    const responseLogin = await chai
      .request(server)
      .post("/api/login")
      .send({
        email: "me@sejuegafutbol.com",
        password: "123"
      });

    expect(responseRegisterUser).to.have.status(201);
    expect(responseLogin).to.have.status(200);
  });
  it("response with a not null token", async () => {
    const responseRegisterUser = await chai
      .request(server)
      .post("/api/user")
      .send({
        email: "me@sejuegafutbol.com",
        name: "Manuel",
        lastName: "Castro",
        password: "123",
        confirmPassword: "123"
      });

    const {
      body: { token }
    } = await chai
      .request(server)
      .post("/api/login")
      .send({
        email: "me@sejuegafutbol.com",
        password: "123"
      });

    expect(responseRegisterUser).to.have.status(201);
    expect(token).to.not.equal(null);
  });
});

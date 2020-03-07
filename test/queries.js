const { createUser } = require("../queries");
const expect = require("chai").expect;
const Pool = require("pg").Pool;

const { user, host, database, password, port } = require("../config");

const pool = new Pool({
  user,
  host,
  database,
  password,
  port,
  min: 1,
  max: 1
});

describe("createUser", () => {
  after(async function() {
    try {
      await pool.query("TRUNCATE TABLE users CASCADE");
      await pool.end();
      console.log("DATABASE clean");
    } catch (error) {
      console.log(error);
    }
  });
  it("should return an error when Name is missing", async () => {
    const user = {
      name: "",
      email: "me@sejuegafutbol.com",
      lastName: "Castro"
    };
    await expect(() => createUser(user)).to.throw("name should have a value");
  });
  it("should return an error when the Last Name is missing", async () => {
    const user = {
      name: "Manuel",
      email: "me@sejuegafutbol.com",
      lastName: ""
    };
    await expect(() => createUser(user)).to.throw("name should have a value");
  });
  it("should return an error when email is missing", async () => {
    const user = {
      name: "Manuel",
      email: "",
      lastName: "Castro"
    };
    await expect(() => createUser(user)).to.throw("email should have a value");
  });
  it("should return an error when password is missing", async () => {
    const user = {
      name: "Manuel",
      email: "me@sejuegafutbol.com",
      lastName: "Castro"
    };
    await expect(() => createUser(user)).to.throw(
      "password should have a value"
    );
  });
  it("should return the number of rows afected", async () => {
    const user = {
      name: "Manuel",
      email: "me@sejuegafutbol.com",
      lastName: "Castro",
      password: "encryptedpassword"
    };
    const results = await createUser(user);
    expect(results).to.equal(1);
  });
});

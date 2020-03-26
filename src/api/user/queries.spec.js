const { createUser, findUserByEmail } = require("./queries");
const expect = require("chai").expect;
const Pool = require("pg").Pool;

const { connectionString } = require("../../config");

const pool = new Pool({
  connectionString: connectionString
});

describe(" DATABASE/MODEL createUser", () => {
  afterEach(async function() {
    try {
      await pool.query("TRUNCATE TABLE users CASCADE");
      await pool.query("ALTER SEQUENCE users_user_id_seq RESTART WITH 1");
    } catch (error) {
      console.log("clean error:", error);
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
  it("should return the user_id", async () => {
    const user = {
      name: "Manuel",
      email: "me@sejuegafutbol.com",
      lastName: "Castro",
      password: "encryptedpassword"
    };
    const results = await createUser(user);
    expect(results.rows[0].user_id).to.equal(1);
  });
});

describe("DATABASE/MODEL findUserByEmail", () => {
  before(async function() {
    try {
      await pool.query("TRUNCATE TABLE users CASCADE");
      await pool.query("ALTER SEQUENCE users_user_id_seq RESTART WITH 1");
    } catch (error) {
      console.log(error);
    }
  });
  it("find the userId by email", async () => {
    const user = {
      name: "Manuel",
      email: "me@sejuegafutbol.com",
      lastName: "Castro",
      password: "encryptedpassword"
    };

    const results = await createUser(user);
    const { userID } = await findUserByEmail("me@sejuegafutbol.com");
    expect(userID).to.equal(results.rows[0].user_id);
  });
  it("find the user password by email", async () => {
    const user = {
      name: "Manuel",
      email: "notme@sejuegafutbol.com",
      lastName: "Castro",
      password: "encryptedpassword"
    };

    await createUser(user);
    const userAuth = await findUserByEmail("notme@sejuegafutbol.com");
    expect(userAuth).to.have.property("password");
  });
  it("return an null user when the user is not found", async () => {
    const user = await findUserByEmail("another@sejuegafutbol.com");

    expect(user).to.equal(null);
  });
});

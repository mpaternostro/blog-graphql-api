const { expect } = require("chai");
const { stub } = require("sinon");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const ServerError = require("../errors/server-error");
const ResourceNotFoundError = require("../errors/resource-not-found");
const UnauthorizedError = require("../errors/unauthorized");
const { login } = require("../graphql/resolvers");
const User = require("../models/User");

let mongoServer;
let args;

async function createTestUser() {
  const user = new User({
    email: "test@test.com",
    password: "123456",
    name: "Tester",
    status: "Hey there!",
    posts: [],
    _id: "5c0f66b979af55031b34728a",
  });
  return user.save();
}

describe("Resolver - Login", () => {
  before(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    args = {
      input: {
        email: "test@test.com",
        password: "123456",
      },
    };
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should return ServerError if User.findOne promise failed", async () => {
    const userFindOneStub = stub(User, "findOne").throws();
    const result = await login(args);

    expect(result).to.be.an.instanceOf(ServerError);
    userFindOneStub.restore();
  });

  it("should return ResourceNotFoundError if no user was found", async () => {
    const result = await login(args);

    expect(result).to.be.an.instanceOf(ResourceNotFoundError);
    expect(result).to.have.property("message", "User not found.");
  });

  it("should return ServerError if bcrypt.compare promise failed", async () => {
    const bcryptCompareStub = stub(bcrypt, "compare").throws();
    await createTestUser();
    const result = await login(args);

    expect(result).to.be.an.instanceOf(ServerError);
    bcryptCompareStub.restore();
  });

  it("should return UnauthorizedError if password did not match", async () => {
    const bcryptCompareStub = stub(bcrypt, "compare").returns(false);
    await createTestUser();
    const result = await login(args);

    expect(result).to.be.an.instanceOf(UnauthorizedError);
    expect(result).to.have.property("message", "Password did not match.");
    bcryptCompareStub.restore();
  });

  it("should return token and userId if password match", async () => {
    const bcryptCompareStub = stub(bcrypt, "compare").returns(true);
    const jwtSignStub = stub(jwt, "sign").returns("jwt-token");
    await createTestUser();
    const result = await login(args);

    expect(result).to.have.property("token", "jwt-token");
    expect(result).to.have.property("userId", "5c0f66b979af55031b34728a");
    bcryptCompareStub.restore();
    jwtSignStub.restore();
  });
});

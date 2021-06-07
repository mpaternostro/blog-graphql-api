const jwt = require("jsonwebtoken");
const { stub } = require("sinon");
const { expect } = require("chai");

const authMiddleware = require("../middlewares/auth");

describe("auth middleware", () => {
  it("should yield isAuth = false if no authorization header is provided", () => {
    const req = {
      get() {
        return null;
      },
    };
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("isAuth", false);
  });
  it("should yield isAuth = false if authorization header has no spaces", () => {
    const req = {
      get() {
        return "test";
      },
    };
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("isAuth", false);
  });
  it("should yield false and userId if token was correctly verified", () => {
    const req = {
      get() {
        return "Bearer asd";
      },
    };
    const verifyStub = stub(jwt, "verify");
    verifyStub.returns({ userId: "test" });

    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("userId", "test");
    expect(req).to.have.property("isAuth", true);
    verifyStub.restore();
  });
  it("should yield isAuth = false if token could not be verified", () => {
    const req = {
      get() {
        return "Bearer asd";
      },
    };

    authMiddleware(req, {}, () => {});
    expect(req).not.to.have.property("userId");
    expect(req).to.have.property("isAuth", false);
  });
});

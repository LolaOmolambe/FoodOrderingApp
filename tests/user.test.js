const request = require("supertest");
const mongoose = require("mongoose");
const User = require("../models/User");

let app;
let user1 = {
  firstName: "John",
  lastName: "Snow",
  email: "fake@yahoo.com",
  password: "1234567",
  passwordConfirm: "1234567",
};

describe("User Authentication Endpoints", () => {
  beforeAll(async () => {
    app = require("../app");
    await User(user1).save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    //await app.close();
    await mongoose.connection.close();
  });

  it("should try to do login with valid credentials and success", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({ email: "fake@yahoo.com", password: "1234567" });

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });
  it("should try to do login with invalid credentials and fail", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({ email: "fake@yahoo.com", password: "fake67889" });

    expect(res.status).toEqual(401);
  });

  it("should try to create user with valid credentials and success", async () => {
    const res = await request(app).post("/api/user/signup").send({
      firstName: "John",
      lastName: "Snow",
      email: "newfake@yahoo.com",
      password: "1234567",
      passwordConfirm: "1234567",
    });
    expect(res.status).toEqual(201);
  });

  it("should try to create user with invalid credentials and fail", async () => {
    const res = await request(app).post("/api/user/signup").send({
      firstName: "John",
      lastName: "Snow",
      email: "newfake2@yahoo.com",
      password: "1234567",
      passwordConfirm: "12345678",
    });

    expect(res.status).toEqual(500);
  });

  it('should try to create user that already exists and fail', async () => {
    const res = await request(app)
            .post('/api/user/signup')
            .send({
                firstName: "John",
                lastName: "Snow",
                email: "fake@yahoo.com",
                password: "fake4567",
                passwordConfirm: "fake4567",
              });
    
    expect(res.status).toEqual(500)
})
});

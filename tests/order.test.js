const request = require("supertest");
const mongoose = require("mongoose");

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

let app;
let user1 = {
  firstName: "John",
  lastName: "Snow",
  email: "fakeadmin1@yahoo.com",
  role: "admin",
  password: "1234567",
  passwordConfirm: "1234567",
};

let product1 = {
  name: "Potatoes",
  description: "Tomato",
  genre: "Vegetables",
  price: 400,
  imagePath: "htttp",
};

describe("Order model Endpoints", () => {
  let token;
  let product;

  beforeAll(async () => {
    app = require("../app");
    const res = await Product(product1).save();
    product = res.body;

    product = await Product.findOne({ name: "Potatoes" });

    await User(user1).save();
    const response = await request(app)
      .post("/api/user/login")
      .send({ email: "fakeadmin1@yahoo.com", password: "1234567" });
    token = response.body.token;
  });

  afterAll(async () => {
      await Order.deleteMany({});
    await mongoose.connection.close();
  });

  it("should try to get all orders ", async () => {
    const res = await request(app)
      .get("/api/order/")
      .set({ Authorization: "Bearer " + token });

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("orders");
  });

  it("should try to get all orders without bearer token and fail", async () => {
    const res = await request(app).get("/api/order/");

    expect(res.status).toEqual(401);
  });

  it("should try to get only logged in user orders", async () => {
    const res = await request(app)
      .get("/api/order/myOrders")
      .set({ Authorization: "Bearer " + token });

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("orders");
  });

  it("should try to get only logged in user orders without token and fail", async () => {
    const res = await request(app).get("/api/order/myOrders");

    expect(res.status).toEqual(401);
  });

  it("should try to add order and success", async () => {
    const res = await request(app)
      .post("/api/order/")
      .set({ Authorization: "Bearer " + token })
      .send({
        orders: [
          {
            imagePath:
              "http://res.cloudinary.com/dgignj2tf/image/upload/v1598060772/VegeFoodsImages/ntjq2of9a2pqove9bjdy.jpg",
            price: 300,
            productId: product._id,
            productName: "Potatoes",
            qty: 2,
            total: 600,
          },
        ],
        total: 1600,
      });

    expect(res.status).toEqual(201);
  });

  it("should try to add order without bearer token and fail", async () => {
    const res = await request(app)
      .post("/api/order/")
      .send({
        orders: [
          {
            imagePath:
              "http://res.cloudinary.com/dgignj2tf/image/upload/v1598060772/VegeFoodsImages/ntjq2of9a2pqove9bjdy.jpg",
            price: 300,
            productId: product._id,
            productName: "Potatoes",
            qty: 2,
            total: 600,
          },
        ],
        total: 1600,
      });

    expect(res.status).toEqual(401);
  });
});

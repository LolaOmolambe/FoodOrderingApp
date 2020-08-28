const request = require("supertest");
const mongoose = require("mongoose");

const Product = require("../models/Product");
const User = require("../models/User");

let app;
let user1 = {
  firstName: "John",
  lastName: "Snow",
  email: "fakeadmin@yahoo.com",
  role: "admin",
  password: "1234567",
  passwordConfirm: "1234567",
};
let product1 = {
  name: "Tomatoes",
  description: "Tomato",
  genre: "Vegetables",
  price: 100,
  imagePath: "htttp",
};
describe("Product model Endpoints", () => {
  let token;
  let product;

  beforeAll(async () => {
    app = require("../app");
    const res = await Product(product1).save();
    product = res.body;

    product = await Product.findOne({ name: "Tomatoes" });
    //console.log("product ", product);
    await User(user1).save();
    const response = await request(app)
      .post("/api/user/login")
      .send({ email: "fakeadmin@yahoo.com", password: "1234567" });
    token = response.body.token;
  });

  afterAll(async () => {
    await Product.deleteMany({});
    //await app.close();
    await mongoose.connection.close();
  });

  it("should try to get all products", async () => {
    const res = await request(app).get("/api/product/");

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("products");
    //expect(res.body.posts).toHaveLength(2)
  });

  it("should try to get product", async () => {
    console.log("id ", product._id);
    const res = await request(app).get("/api/product/" + product._id);
    //console.log("resss ", res.body);
    expect(res.status).toEqual(200);
    expect(res.body.name).toEqual(product.name);
  });

  it("should try to edit product and success", async () => {
    const res = await request(app)
      .put("/api/product/" + product._id)
      .set({ Authorization: "Bearer " + token })
      .send({
        id: product._id,
        title: "Tomatoes",
        description: "Tomato",
        genre: "Fruit",
        price: 100,
        imagePath: "htttp",
      });
    expect(res.status).toEqual(200);
  });

  it("should try to edit product without bearer token and fail", async () => {
    const res = await request(app)
      .put("/api/product/" + product._id)
      .send({
        id: product._id,
        title: "Tomatoes",
        description: "Tomato",
        genre: "Fruit",
        price: 100,
        imagePath: "htttp",
      });

    expect(res.status).toEqual(401);
  });

  it("should try to create product without bearer token and fail", async () => {
    const res = await request(app).post("/api/product/").send({
      title: "Onions",
      description: "Onion Types",
      genre: "Dried",
      price: 300,
      image: "",
    });

    expect(res.status).toEqual(401);
  });

  it("should try to create product without params and fail", async () => {
    const res = await request(app)
      .post("/api/product/")
      .set({ Authorization: "Bearer " + token })
      .send();
    expect(res.status).not.toEqual(201);
  });
  it("should try to delete product and success", async () => {
    const productDelete = await Product.findOne({ name: "Tomatoes" });
    const res = await request(app)
      .delete("/api/product/" + productDelete._id)
      .set({ Authorization: "Bearer " + token });

    expect(res.status).toEqual(200);
  });
});

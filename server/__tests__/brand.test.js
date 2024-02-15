const request = require("supertest");
const app = require("../app");
const { User, Product, Brand } = require("../models");
const { signToken } = require("../helpers/jwt");

let accessToken;
beforeAll(async () => {
  const user = await User.create({
    email: "Admin1@mail.com",
    password: "Admin1",
    role: "Admin",
  });
  accessToken = signToken({ id: user.id, email: user.email });
  const brand = await Brand.create({
    name: "Hermes",
  });
  const product = await Product.create({
    category: "Belt",
    name: "Hermes Belt",
    imgUrl:
      "https://i.pinimg.com/564x/da/73/38/da7338f3339e54febd403c66772d99d9.jpg",
    description: "Hermes Belt",
    price: 35000000,
    stock: 60,
    userId: 1,
    brandId: 1,
  });
});

afterAll(async () => {
  await User.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await Brand.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await Product.destroy({
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("GET /categories", () => {
  test("a. Berhasil mendapatkan data Entitas Kedua", async () => {
    const response = await request(app)
      .get("/brands")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("b. Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app).get("/brands");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Error authentication");
  });

  test("c. Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    accessToken = "(random string)";

    const response = await request(app)
      .get("/brands")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Error authentication");
  });
});

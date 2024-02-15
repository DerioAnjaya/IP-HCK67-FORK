const request = require("supertest");
const app = require("../app");
const { User, Product, Brand } = require("../models");
const { signToken } = require("../helper/jwt");

let accessToken;
let accessToken2;
let productId;
let productId2;
let productId3;
let productName;
beforeAll(async () => {
  const user = await User.create({
    email: "Admin1@mail.com",
    password: "Admin1",
    role: "Admin",
  });
  accessToken = signToken({ id: user.id, email: user.email });

  const user2 = await User.create({
    email: "Staff1@mail.com",
    password: "Staff1",
    role: "Staff",
  });
  accessToken2 = signToken({ id: user2.id, email: user2.email });

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
  productId = product.id;
  productName = product.name;
  const product2 = await Product.create({
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
  productId2 = product2.id;
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
});

test("a. berhasil membuat entitas utama", async () => {
  const createProduct = {
    category: "Belt",
    name: "Hermes Belt",
    imgUrl:
      "https://i.pinimg.com/564x/da/73/38/da7338f3339e54febd403c66772d99d9.jpg",
    description: "Hermes Belt",
    price: 35000000,
    stock: 60,
    userId: 1,
    brandId: 1,
  };

  const response = await request(app)
    .post("/products")
    .set("Authorization", `Bearer ${accessToken}`)
    .send(createProduct);
  // console.log(response.status, response.body);

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty("id", expect.any(Number));
  expect(response.body).toHaveProperty("category", expect.any(String));
  expect(response.body).toHaveProperty("name", expect.any(String));
  expect(response.body).toHaveProperty("imgUrl", expect.any(String));
  expect(response.body).toHaveProperty("description", expect.any(String));
  expect(response.body).toHaveProperty("price", expect.any(Number));
  expect(response.body).toHaveProperty("stock", expect.any(Number));
  expect(response.body).toHaveProperty("userId", expect.any(Number));
  expect(response.body).toHaveProperty("brandId", expect.any(Number));
});

test("d. Error validasi ketika name tidak ada", async () => {
  const createProduct = {
    category: "Belt",
    imgUrl:
      "https://i.pinimg.com/564x/da/73/38/da7338f3339e54febd403c66772d99d9.jpg",
    description: "Hermes Belt",
    price: 35000000,
    stock: 60,
    userId: 1,
    brandId: 1,
  };

  const response = await request(app)
    .post("/products")
    .set("Authorization", `Bearer ${accessToken}`)
    .send(createProduct);
  // console.log(response.status, response.body);
  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message", "Name cannot empty");
});

test("Error validasi ketika description tidak ada", async () => {
  const createProduct = {
    category: "Belt",
    name: "Hermes Belt",
    imgUrl:
      "https://i.pinimg.com/564x/da/73/38/da7338f3339e54febd403c66772d99d9.jpg",
    price: 35000000,
    stock: 60,
    userId: 1,
    brandId: 1,
  };

  const response = await request(app)
    .post("/products")
    .set("Authorization", `Bearer ${accessToken}`)
    .send(createProduct);

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message", "Description cannot empty");
});

test("Error validasi ketika price tidak ada", async () => {
  const createProduct = {
    category: "Belt",
    name: "Hermes Belt",
    imgUrl:
      "https://i.pinimg.com/564x/da/73/38/da7338f3339e54febd403c66772d99d9.jpg",
    description: "Hermes Belt",
    stock: 60,
    userId: 1,
    brandId: 1,
  };

  const response = await request(app)
    .post("/products")
    .set("Authorization", `Bearer ${accessToken}`)
    .send(createProduct);

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message", "Price cannot empty");
});

test("Error validasi ketika brandId tidak ada", async () => {
  const createProduct = {
    category: "Belt",
    name: "Hermes Belt",
    imgUrl:
      "https://i.pinimg.com/564x/da/73/38/da7338f3339e54febd403c66772d99d9.jpg",
    description: "Hermes Belt",
    price: 35000000,
    stock: 60,
    userId: 1,
  };

  const response = await request(app)
    .post("/products")
    .set("Authorization", `Bearer ${accessToken}`)
    .send(createProduct);

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message", "Brand Id cannot empty");
});

test("Error validasi ketika name kosong", async () => {
  const createProduct = {
    category: "Belt",
    name: "",
    imgUrl:
      "https://i.pinimg.com/564x/da/73/38/da7338f3339e54febd403c66772d99d9.jpg",
    description: "Hermes Belt",
    price: 35000000,
    stock: 60,
    userId: 1,
    brandId: 1,
  };

  const response = await request(app)
    .post("/products")
    .set("Authorization", `Bearer ${accessToken}`)
    .send(createProduct);

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message", "Name cannot empty");
});

test("Error validasi ketika description kosong", async () => {
  const createProduct = {
    category: "Belt",
    name: "Hermes Belt",
    imgUrl:
      "https://i.pinimg.com/564x/da/73/38/da7338f3339e54febd403c66772d99d9.jpg",
    description: "",
    price: 35000000,
    stock: 60,
    userId: 1,
    brandId: 1,
  };

  const response = await request(app)
    .post("/products")
    .set("Authorization", `Bearer ${accessToken}`)
    .send(createProduct);

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message", "Description cannot empty");
});

test("Error validasi ketika price kosong", async () => {
  const createProduct = {
    category: "Belt",
    name: "Hermes Belt",
    imgUrl: "https://i.pinimg.com/564x/da/73/38/da7338f3339e54febd403c66772d99d9.jpg",
    description: "Hermes Belt",
    price: null,
    stock: 60,
    userId: 1,
    brandId: 1
  };

  const response = await request(app)
    .post("/products")
    .set("Authorization", `Bearer ${accessToken}`)
    .send(createProduct);

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message", "Price cannot empty");
});

test("Error validasi ketika BrandId kosong", async () => {
  const createProduct = {
    category: "Belt",
    name: "Hermes Belt",
    imgUrl: "https://i.pinimg.com/564x/da/73/38/da7338f3339e54febd403c66772d99d9.jpg",
    description: "Hermes Belt",
    price: 35000000,
    stock: 60,
    userId: 1,
    brandId: null
  };

  const response = await request(app)
    .post("/products")
    .set("Authorization", `Bearer ${accessToken}`)
    .send(createProduct);

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message", "Brand Id cannot empty");
});

test("Error validasi ketika price dibawah minimum (1000)", async () => {
  const createProduct = {
    category: "Belt",
    name: "Hermes Belt",
    imgUrl: "https://i.pinimg.com/564x/da/73/38/da7338f3339e54febd403c66772d99d9.jpg",
    description: "Hermes Belt",
    price: 100,
    stock: 60,
    userId: 1,
    brandId: 1
  };

  const response = await request(app)
    .post("/products")
    .set("Authorization", `Bearer ${accessToken}`)
    .send(createProduct);

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message", "Price must be above 1000");
});

test("b Gagal menjalankan fitur karena belum login", async () => {
  const createProduct = {
    category: "Belt",
    name: "Hermes Belt",
    imgUrl: "https://i.pinimg.com/564x/da/73/38/da7338f3339e54febd403c66772d99d9.jpg",
    description: "Hermes Belt",
    price: 35000000,
    stock: 60,
    userId: 1,
    brandId: 1
  };

  const response = await request(app).post("/products").send(createProduct);
  // console.log(response.status, response.body);

  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty("message", "Error authentication");
});

test("a. Berhasil mendapatkan data Entitas Utama", async () => {
  const response = await request(app)
    .get("/products")
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(200);
  expect(response.body).toBeInstanceOf(Array);
  expect(response.body.length).toBeGreaterThan(0);
});

test("b. Gagal menjalankan fitur karena belum login", async () => {
  const response = await request(app).get("/products");

  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty("message", "Error authentication");
});

test("a. Berhasil mendapatkan 1 Entitas Utama sesuai dengan params id yang diberikan", async () => {
  const response = await request(app)
    .get("/products/1")
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(200);
  expect(response.body).toBeInstanceOf(Object);
});

test("b. Gagal menjalankan fitur karena belum login", async () => {
  const response = await request(app).get("/products/1");

  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty("message", "Error authentication");
});

test("d. Gagal mendapatkan Entitas Utama sesuai dengan params id yang diberikan tidak ada di database/ invalid", async () => {
  const response = await request(app)
    .get("/products/1000")
    .set("Authorization", `Bearer ${accessToken}`);
  console.log(response.status, response.body);
  expect(response.status).toBe(404);
  expect(response.body).toHaveProperty("message", "Data not found");
});

test("a. Berhasil mengupdate data Entitas Utama berdasarkan params id yang diberikan", async () => {
  const updateCategories = {
    category: "Belt",
    name: "Hermes Belt",
    imgUrl: "https://i.pinimg.com/564x/da/73/38/da7338f3339e54febd403c66772d99d9.jpg",
    description: "Hermes Belt",
    price: 35000000,
    stock: 60,
    userId: 1,
    brandId: 1
  };

  const response = await request(app)
    .put(`/products/${+productId}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send(updateCategories); 

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("id", expect.any(Number));
  expect(response.body).toHaveProperty("category", expect.any(String));
  expect(response.body).toHaveProperty("name", expect.any(String));
  expect(response.body).toHaveProperty("imgUrl", expect.any(String));
  expect(response.body).toHaveProperty("description", expect.any(String));
  expect(response.body).toHaveProperty("price", expect.any(Number));
  expect(response.body).toHaveProperty("stock", expect.any(Number));
  expect(response.body).toHaveProperty("userId", expect.any(Number));
  expect(response.body).toHaveProperty("brandId", expect.any(Number));
});

test("b Gagal menjalankan fitur karena belum login", async () => {
  const updateCategories = {
    category: "Belt",
    name: "Hermes Belt",
    imgUrl: "https://i.pinimg.com/564x/da/73/38/da7338f3339e54febd403c66772d99d9.jpg",
    description: "Hermes Belt",
    price: 35000000,
    stock: 60,
    userId: 1,
    brandId: 1
  };

  const response = await request(app)
    .put(`/products/${+productId}`)
    .send(updateCategories);

  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty("message", "Error authentication");
});

test("d. Gagal karena id entity yang dikirimkan tidak terdapat di database", async () => {
  const updateCategories = {
    category: "Belt",
    name: "Hermes Belt",
    imgUrl: "https://i.pinimg.com/564x/da/73/38/da7338f3339e54febd403c66772d99d9.jpg",
    description: "Hermes Belt",
    price: 35000000,
    stock: 60,
    userId: 1,
    brandId: 1
  };

  const response = await request(app)
    .put(`/products/${10000}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send(updateCategories);

  expect(response.status).toBe(404);
  expect(response.body).toHaveProperty("message", "Data not found");
});

test("e. Gagal menjalakan fitur ketika Staff mengolah data entity yang bukan miliknya", async () => {
  const updateCategories = {
    category: "Belt",
    name: "Hermes Belt",
    imgUrl: "https://i.pinimg.com/564x/da/73/38/da7338f3339e54febd403c66772d99d9.jpg",
    description: "Hermes Belt",
    price: 35000000,
    stock: 60,
    userId: 1,
    brandId: 1,
  };

  const response = await request(app)
    .put(`/products/${+productId}`)
    .set("Authorization", `Bearer ${accessToken2}`)
    .send(updateCategories);

  expect(response.status).toBe(403);
  expect(response.body).toHaveProperty("message", "Forbidden");
});

test("Error validasi ketika name kosong", async () => {
  const createProduct = {
    category: "Belt",
    name: "",
    imgUrl: "https://i.pinimg.com/564x/da/73/38/da7338f3339e54febd403c66772d99d9.jpg",
    description: "Hermes Belt",
    price: 35000000,
    stock: 60,
    userId: 1,
    brandId: 1
  };

  const response = await request(app)
    .put(`/products/${+productId}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send(createProduct);

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message", "Name cannot empty");
});

test("Error validasi ketika description kosong", async () => {
  const createProduct = {
    category: "Belt",
    name: "Hermes Belt",
    imgUrl: "https://i.pinimg.com/564x/da/73/38/da7338f3339e54febd403c66772d99d9.jpg",
    description: "",
    price: 35000000,
    stock: 60,
    userId: 1,
    brandId: 1
  };

  const response = await request(app)
    .put(`/products/${+productId}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send(createProduct);

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message", "Description cannot empty");
});

test("Error validasi ketika price kosong", async () => {
  const createProduct = {
    category: "Belt",
    name: "Hermes Belt",
    imgUrl: "https://i.pinimg.com/564x/da/73/38/da7338f3339e54febd403c66772d99d9.jpg",
    description: "Hermes Belt",
    price: null,
    stock: 60,
    userId: 1,
    brandId: 1
  };

  const response = await request(app)
    .put(`/products/${+productId}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send(createProduct);

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message", "Price cannot empty");
});

test("Error validasi ketika BrandId kosong", async () => {
  const createProduct = {
    category: "Belt",
    name: "Hermes Belt",
    imgUrl: "https://i.pinimg.com/564x/da/73/38/da7338f3339e54febd403c66772d99d9.jpg",
    description: "Hermes Belt",
    price: 35000000,
    stock: 60,
    userId: 1,
    brandId: null
  };

  const response = await request(app)
    .put(`/products/${+productId}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send(createProduct);

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message", "Brand Id cannot empty");
});

test("Error validasi ketika price dibawah minimum (1000)", async () => {
  const createProduct = {
    category: "Belt",
    name: "Hermes Belt",
    imgUrl: "https://i.pinimg.com/564x/da/73/38/da7338f3339e54febd403c66772d99d9.jpg",
    description: "Hermes Belt",
    price: 500,
    stock: 60,
    userId: 1,
    brandId: 1
  };

  const response = await request(app)
    .put(`/products/${+productId}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send(createProduct);

  expect(response.status).toBe(400);
  expect(response.body).toHaveProperty("message", "Price must be above 1000");
});

test("a. Berhasil mengahpus data Entitas Utama berdasarkan params id yang diberikan", async () => {
  const response = await request(app)
    .delete(`/products/${+productId}`)
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty(
    "message",
    `${productName} success to delete`
  );
});

test("b Gagal menjalankan fitur karena belum login", async () => {
  const response = await request(app).delete(`/products/${+productId}`);

  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty("message", "Error authentication");
});

test("d. Gagal karena id entity yang dikirimkan tidak terdapat di database", async () => {
  const response = await request(app)
    .delete(`/products/${10000}`)
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(404);
  expect(response.body).toHaveProperty("message", "Data not found");
});

test("e. Gagal menjalakan fitur ketika Staff mengolah data entity yang bukan miliknya", async () => {
  const response = await request(app)
    .delete(`/products/${+productId2}`)
    .set("Authorization", `Bearer ${accessToken2}`);
  // console.log(response.status, response.body);

  expect(response.status).toBe(403);
  expect(response.body).toHaveProperty("message", "Forbidden");
});

test("a. Berhasil mengupdate imageUrl Entitas Utama berdasarkan params id yang diberikan", async () => {
  const response = await request(app)
    .patch(`/products/${+productId2}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .attach("imgUrl", "./data/kambing.jpeg");

  expect(response.status).toBe(200);
  expect(response.body.message).toEqual("Image image_url success to update");
});

test("b. Gagal menjalankan fitur karena belum login", async () => {
  const response = await request(app)
    .patch(`/products/${+productId}`)
    .attach("imgUrl", "./data/kambing.jpeg");

  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty("message", "Error authentication");
});

test("d. Gagal karena id entity yang dikirimkan tidak terdapat di database", async () => {
  const response = await request(app)
    .patch(`/products/${1000}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .attach("imgUrl", "./data/kambing.jpeg");

  expect(response.status).toBe(404);
  expect(response.body).toHaveProperty("message", "Data not found");
});

test("e. Gagal menjalakan fitur ketika Staff mengolah data entity yang bukan miliknya", async () => {
  const response = await request(app)
    .patch(`/products/${+productId2}`)
    .set("Authorization", `Bearer ${accessToken2}`)
    .attach("imgUrl", "./data/kambing.jpeg");

  expect(response.status).toBe(403);
  expect(response.body).toHaveProperty("message", "Forbidden");
});

test("f. Gagal ketika request body yang diberikan tidak sesuai", async () => {
  const response = await request(app)
    .patch(`/products/${+productId2}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send({ imgUrl: "./data/kambing.jpeg" });

  expect(response.status).toBe(400);
  expect(response.body.message).toEqual("Please upload an image");
});

test("c. Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
  accessToken = "(random string)";

  const response = await request(app)
    .get("/products")
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty("message", "Error authentication");
});

test("c. Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
  const createProduct = {
    category: "Belt",
    name: "Hermes Belt",
    imgUrl: "https://i.pinimg.com/564x/da/73/38/da7338f3339e54febd403c66772d99d9.jpg",
    description: "Hermes Belt",
    price: 35000000,
    stock: 60,
    userId: 1,
    brandId: 1
  };

  accessToken = "(random string)";

  const response = await request(app)
    .post("/products")
    .set("Authorization", `Bearer ${accessToken}`)
    .send(createProduct);

  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty("message", "Error authentication");
});

test("c. Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
  accessToken = "(random string)";

  const response = await request(app)
    .get("/products/1")
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty("message", "Error authentication");
});

test("c. Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
  accessToken = "(random string)";
  const response = await request(app)
    .delete(`/products/${+productId}`)
    .set("Authorization", `Bearer ${accessToken}`);

  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty("message", "Error authentication");
});

test("c. Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
  const updateCategories = {
    category: "Belt",
    name: "Hermes Belt",
    imgUrl: "https://i.pinimg.com/564x/da/73/38/da7338f3339e54febd403c66772d99d9.jpg",
    description: "Hermes Belt",
    price: 35000000,
    stock: 60,
    userId: 1,
    brandId: 1
  };

  accessToken = "(random string)";
  const response = await request(app)
    .put(`/products/${+productId}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .send(updateCategories);

  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty("message", "Error authentication");
});

test("c. Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
  accessToken = "(random string)";
  const response = await request(app)
    .patch(`/products/${+productId}`)
    .set("Authorization", `Bearer ${accessToken}`)
    .attach("imgUrl", "./data/kambing.jpeg");

  expect(response.status).toBe(401);
  expect(response.body).toHaveProperty("message", "Error authentication");
});

const request = require("supertest")
const app = require('../app')
const { User, Product, Brand } = require('../models')
const { sequelize } = require('../models')
const { signToken } = require('../helpers/jwt')
const { queryInterface } = sequelize

const brand = require("../data/brand.json").map((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();
    return el;
});
const user = require("../data/user.json").map((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();

    return el;
});
console.log(user, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
const product = require("../data/products.json").map((el) => {
    el.createdAt = new Date();
    el.updatedAt = new Date();
    return el;
});

beforeAll(async () => {
    await queryInterface.bulkInsert("Users", user, {});
    await queryInterface.bulkInsert("Brands", brand, {});
    await queryInterface.bulkInsert("Products", product, {});
})

afterAll(async () => {
    await queryInterface.bulkDelete("Users", null, {
		truncate: true,
		cascade: true,
		restartIdentity: true,
	});
	await queryInterface.bulkDelete("Brands", null, {
		truncate: true,
		cascade: true,
		restartIdentity: true,
	});
	await queryInterface.bulkDelete("Products", null, {
		truncate: true,
		cascade: true,
		restartIdentity: true,
	});
})

describe("GET /publics/pub", () => {
    test("a. Berhasil mendapatkan Entitas Utama tanpa menggunakan query filter paramater", async () => {
        const response = await request(app).get('/publics/pub')

        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBeGreaterThan(0)
    })

    test("b. Berhasil mendapatkan Entitas Utama dengan 1 query filter paramater", async () => {
        const response = await request(app).get('/publics/pub?filter=1')
        // console.log(response.status, response.body[0].brandId);

        expect(response.status).toBe(200)
        expect(response.body[0].brandId).toEqual(1)
    });

    test("c. Berhasil mendapatkan Entitas Utama serta panjang yang sesuai ketika memberikan page tertentu", async () => {
        const response = await request(app).get('/publics/pub?page=1')
        // console.log(response.status, response.body.length);

        expect(response.status).toBe(200)
        expect(response.body.length).toEqual(10)
    });
})

describe("GET /publics/pub/:id", () => {
    test("a. Berhasil mendapatkan 1 Entitas Utama sesuai dengan params id yang diberikan", async () => {
        const response = await request(app).get(`/publics/pub/${3}`)
        console.log(response.body);

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty("id", 3)
    })

    test("b. Gagal mendapatkan Entitas Utama karena params id yang diberikan tidak ada di database / invalid", async () => {
        const response = await request(app).get(`/publics/pub/${1000}`)

        expect(response.status).toBe(404)
		expect(response.body.message).toEqual("Data not found")
    });
})
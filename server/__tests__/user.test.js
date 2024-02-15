const request = require("supertest")
const app = require('../app')
const { User } = require('../models')
const { signToken } = require('../helpers/jwt')

let accessToken
beforeAll(async () => {
    const user = await User.create({
        email: "Admin1@mail.com",
        password: "Admin1",
        role: "Admin"
    })
    accessToken = signToken({ id: user.id, email: user.email })
})

afterAll(async () => {
    await User.destroy({
        truncate: true,
        cascade: true,
        restartIdentity: true,
    })
})

describe("POST /add-user", () => {
    test("a. Berhasilkan menambahkan user", async () => {
        const dataAddedUser = ({
            username: "Staff2@Nih",
            email: "Staff2@mail.com",
            password: "Staff2"
        })

        const response = await request(app).post('/add-user').set("Authorization", `Bearer ${accessToken}`).send(dataAddedUser)
        // console.log(response.body, '<<<<<<||||||||||||||||||||||');
        
        console.log(response.body, "<<<<<<<");
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty("id", expect.any(Number))
        expect(response.body).toHaveProperty("username", "Staff2@Nih")
        expect(response.body).toHaveProperty("email", "Staff2@mail.com")
    })

    test("b. Email tidak diberikan / tidak diinput", async () => {
        const dataAddedUser = ({
            email: "",
            password: "Staff2"
        })

        const response = await request(app).post('/add-user').set("Authorization", `Bearer ${accessToken}`).send(dataAddedUser)
        // console.log(response.status, response.body);
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message", "Email cannot empty")
    })

    test("c. Password tidak diberikan / tidak diinput", async () => {
        const dataAddedUser = ({
            email: "Staff2@mail.com"
        })

        const response = await request(app).post('/add-user').set("Authorization", `Bearer ${accessToken}`).send(dataAddedUser)
        // console.log(response.status, response.body);
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message", "Password cannot empty")
    })

    test("d. Email diberikan string kosong", async () => {
        const dataAddedUser = ({
            email: " ",
            password: "Staff2"
        })

        const response = await request(app).post('/add-user').set("Authorization", `Bearer ${accessToken}`).send(dataAddedUser)
        // console.log(response.status, response.body);
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message", "Email cannot empty")
    })

    test("e. Password diberikan string kosong", async () => {
        const dataAddedUser = ({
            email: "Staff2@mail.com",
            password: ""
        })

        const response = await request(app).post('/add-user').set("Authorization", `Bearer ${accessToken}`).send(dataAddedUser)
        // console.log(response.status, response.body);
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message", "Minimum 5 characters password")
    })

    test("f. Email sudah terdaftar", async () => {
        const dataAddedUser = ({
            email: "Staff2@mail.com",
            password: "Staff2"
        })

        const response = await request(app).post('/add-user').set("Authorization", `Bearer ${accessToken}`).send(dataAddedUser)
        // console.log(response.status, response.body);
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message", "Email must be unique")
    })

    test("g. Format email salah / invalid", async () => {
        const dataAddedUser = ({
            email: "Staff2@mail.com",
            password: "Staff2"
        })

        const response = await request(app).post('/add-user').set("Authorization", `Bearer ${accessToken}`).send(dataAddedUser)
        // console.log(response.status, response.body);
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty("message", "Formated email required")
    })

    test("h. Gagal menambahkan user karena tidak terdaftar access_token", async () => {
        const dataAddedUser = ({
            email: "Staff2@mail.com",
            password: "Staff2"
        })

        const response = await request(app).post('/add-user').send(dataAddedUser)
        // console.log(response.status, response.body);
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty("message", "Error authentication")
    })

    test("i. Gagal menambahkan user karena token yang diberikan tidak valid (random string)", async () => {
        const dataAddedUser = ({
            email: "Staff2@mail.com",
            password: "Staff2"
        })
        accessToken = "(random string)"

        const response = await request(app).post('/add-user').set("Authorization", `Bearer ${accessToken}`).send(dataAddedUser)
        // console.log(response.status, response.body);

        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty("message", "Error authentication")
    })
})

describe("POST /login", () => {
    test("a. Berhasil login dan mengirimkan access_token", async () => {
        const dataLoginUser = {
            email: "Admin1@mail.com",
            password: "Admin1",
        };

        const response = await request(app).post("/login").send(dataLoginUser);
        // console.log(response);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("accessToken", expect.any(String));
    });

    test("b. Email tidak diberikan/ tidak diinput", async () => {
        const dataLoginUser = {
            email: "",
            password: "Admin1",
        };

        const response = await request(app).post("/login").send(dataLoginUser);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Email cannot empty");
    });

    test("c. Password tidak diberikan/ tidak diinput", async () => {
        const dataLoginUser = {
            email: "Admin1@mail.com",
            password: ""
        }

        const response = await request(app).post("/login").send(dataLoginUser)

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Password cannot empty")
    })

    test("d. Email diberikan invalid / tidak terdaftar", async () => {
        const dataLoginUser = {
            email: "admin1000@mail.com",
            password: "Admin1"
        }

        const response = await request(app).post('/login').send(dataLoginUser)
        
        expect(response.status).toBe(401)
        // console.log(response.body, '<<<<<||||||||');
        expect(response.body).toHaveProperty("message", "user not found")
    })

    test("e. Password diberikan salah/ tidak match", async () => {
        const dataLoginUser = ({
            email: "Admin1@mail.com",
            password: "admin100"
        })

        const response = await request(app).post('/login').send(dataLoginUser)

        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty("message", "user not found")
    })
});
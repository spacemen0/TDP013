import request from "supertest";
import { expect } from "chai";
import app from "../server.js";
import {
    connectToDatabase,
    getDatabaseConnection,
    closeDatabaseConnection,
} from "../db/conn.js";

const dbConfig = {
    host: "localhost",
    user: "",
    pass: "",
    db: "testDatabase",
    options: "",
};

describe("Messages API", () => {
    before(async () => {
        connectToDatabase(dbConfig);
    });

    after(async () => {
        const db = getDatabaseConnection();
        await db.collection("messages").deleteMany({});
        closeDatabaseConnection();
    });

    it("should create a message", async () => {
        const res = await request(app)
            .post("/messages")
            .send({ message: "Test message" });

        expect(res.status).to.equal(200);
        expect(res.body).to.include({
            message: "Message saved successfully",
        });
        expect(res.body).to.have.property("id").that.is.a("string");
    });

    it("should return 400 if message is empty", async () => {
        const res = await request(app)
            .post("/messages")
            .send({ message: "   " });

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property("error", "Valid message content is required");
    });

    it("should return 404 for non-existent route", async () => {
        const res = await request(app)
            .get("/notexist");

        expect(res.status).to.equal(404);
    });

    it("should return 405 for incorrect method on /messages route", async () => {
        const res = await request(app)
            .put("/messages")
            .send({ message: "Invalid method" });

        expect(res.status).to.equal(405);
    });

    it("should return 400 for invalid message format", async () => {
        const res = await request(app)
            .post("/messages")
            .send({ invalidField: "Invalid format" });

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property("error", "Valid message content is required");
    });

    it("should get message after it is created", async () => {
        let res = await request(app)
            .post("/messages")
            .send({ message: "Test message" });

        const id = res.body.id;

        res = await request(app)
            .get(`/messages/${id}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message", "Test message");
    });
});

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

    it("should create a new message and return a success response", async () => {
        const res = await request(app)
            .post("/messages")
            .send({ message: "321312312312" });

        expect(res.status).to.equal(200);
        expect(res.body).to.include({
            message: "Message saved successfully",
        });
        expect(res.body).to.have.property("id").that.is.a("string");
    });

    it("should return a 400 error if the message content is empty or invalid", async () => {
        const res = await request(app)
            .post("/messages")
            .send({ message: "   " });

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property("error", "Valid message content is required");
    });

    it("should return a 404 error for a non-existent route", async () => {
        const res = await request(app)
            .get("/notexist");

        expect(res.status).to.equal(404);
    });

    it("should return a 405 error for incorrect HTTP methods on the /messages route", async () => {
        const res = await request(app)
            .put("/messages")
            .send({ message: "Invalid method" });

        expect(res.status).to.equal(405);
    });

    it("should update the read status of a message and return a success response", async () => {
        let res = await request(app)
            .post("/messages")
            .send({ message: "Test message" });

        const id = res.body.id;

        res = await request(app)
            .patch(`/messages/${id}`).send({ read: true });

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("message", "Message updated successfully");
    });

    it("should return a 404 error for an invalid or non-existent message ID", async () => {
        let res = await request(app)
            .post("/messages")
            .send({ message: "Test message" });

        const id = res.body.id;

        res = await request(app)
            .patch(`/messages/${id.slice(0, -3) + "aaa"}`).send({ read: true });

        expect(res.status).to.equal(404);
        expect(res.body).to.have.property("error", "Message not found");
    });

    it("should return a 400 error for an invalid message format", async () => {
        const res = await request(app)
            .post("/messages")
            .send({ invalidField: "Invalid format" });

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property("error", "Valid message content is required");
    });

    it("should retrieve a specific message by its ID", async () => {
        let res = await request(app)
            .post("/messages")
            .send({ message: "Test message" });

        const id = res.body.id;

        res = await request(app)
            .get(`/messages/${id}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message", "Test message");
    });

    it("should retrieve all messages and verify the response is an array", async () => {
        const res = await request(app)
            .get(`/messages`);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("array");
    });
});

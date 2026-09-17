import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";
test("health endpoint returns the API status", async () => { const response = await request(app).get("/api/v1/health"); assert.equal(response.status, 200); assert.equal(response.body.success, true); assert.equal(response.body.message, "AfyaNow API is running"); });

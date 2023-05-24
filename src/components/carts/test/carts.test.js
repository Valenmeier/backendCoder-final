import chai from "chai";
import supertest from "supertest";
import { describe, it } from "mocha";
import { CartController } from "../cartController.js";
import dotenv from "dotenv";
dotenv.config();

const { expect } = chai;
const requester = supertest(`${process.env.DOMAIN_NAME}`);

describe("Cart API", () => {
  let cartController = new CartController();

  describe("GET /cart", () => {
    it("should get all carts", (done) => {
      requester.get("/api/carts").end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        expect(res.body.carts).to.be.an("array");
        done();
      });
    });
  });

  describe("GET /cart/:pid", () => {
    it("should get a cart by id", (done) => {
      const cartId = "6426f3a056b78d86326b19d1";
      requester.get(`/api/carts/${cartId}`).end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(200);
        expect(res.body[0]).to.be.an("object");
        expect(res.body[0]._id).to.equal(cartId);
        done();
      });
    });

    it("should return an error if the cart id is invalid", (done) => {
      const invalidCartId = "invalid_id";
      requester.get(`/api/carts/${invalidCartId}`).end((err, res) => {
        expect(err).to.be.null;
        expect(res.status).to.be.equal(400);
        expect(res.body).to.be.an("object");
        done();
      });
    });
  });
});

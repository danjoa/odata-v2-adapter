"use strict";

const supertest = require("supertest");

const env = require("./_env");
const util = require("./_env/util");

let context;
let request;

describe("main-requests", () => {
  beforeAll(async () => {
    context = await env("index");
    request = supertest(context.app);
  });

  afterAll(() => {
    env.end(context);
  });

  it("GET $metadata", async () => {
    const response = await util.callRead(request, "/v2/main/$metadata", {
      accept: "application/xml",
    });
    expect(response.body).toBeDefined();
    expect(response.text).toMatchSnapshot();
  });

  it("GET with parameters", async () => {
    const stock = Math.round(new Date().getTime() / 1000);
    await util.callWrite(request, "/v2/main/Header", {
      stock: stock,
      currency: "USD",
    });
    await util.callWrite(request, "/v2/main/Header", {
      stock: 1,
      currency: "EUR",
    });
    const response = await util.callRead(request, `/v2/main/HeaderParameters(STOCK=${stock},CURRENCY='USD')/Set`);
    expect(response.body).toBeDefined();
    expect(response.body.d.results).toHaveLength(1);
    expect(response.body.d.results).toMatchObject([
      {
        __metadata: {
          type: "test.MainService.HeaderParameters",
        },
        country: null,
        createdBy: "anonymous",
        currency: "USD",
        description: null,
        modifiedBy: "anonymous",
        name: null,
        price: null,
        stock: stock,
      },
    ]);
  });
});

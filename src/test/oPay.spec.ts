import * as mocha from "mocha";
import * as assert from "assert";
import * as should from "should";
require("should");
import { OPay, OPayConfig } from "../";
describe("oPay.ts", () => {
  describe("class OPay", () => {
    it("new class", () => {
      let oPay = new OPay(new OPayConfig());
      oPay.should.not.null();
    });
  });
});

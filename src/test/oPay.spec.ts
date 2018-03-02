import * as mocha from "mocha";
import * as assert from "assert";
import * as should from "should";
import { OPay, OPayConfig } from "../";
describe("oPay.ts", () => {
  describe("class OPay", () => {
    it("new class", () => {
      assert(new OPay(new OPayConfig()) != null);
    });
  });
});

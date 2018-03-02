import * as mocha from "mocha";
import * as assert from "assert";
import * as should from "should";
require("should");
import { generateMerchantTradeNo, urlEncodeDotNet } from "../";
describe("util.ts", () => {
  describe("generateMerchantTradeNo", () => {
    it("success", () => {
      generateMerchantTradeNo().should.is.String();
      generateMerchantTradeNo().length.should.equal(20);
      generateMerchantTradeNo()
        .substr(0, 2)
        .should.equal("TN");
    });
  });
  describe("urlEncodeDotNet", () => {
    it("success", () => {
      urlEncodeDotNet("abc123ABC-_<>?/|{}[]()!@#$%^&*~`\"'=+").should.equal(
        "abc123abc-_%3c%3e%3f%2f%7c%7b%7d%5b%5d()!%40%23%24%25%5e%26*%7e%60%22%27%3d%2b"
      );
    });
    it("input is not string", () => {
      (function() {
        urlEncodeDotNet(0 as any);
      }.should.throw());
      (function() {
        urlEncodeDotNet({} as any);
      }.should.throw());
      (function() {
        urlEncodeDotNet(true as any);
      }.should.throw());
      (function() {
        urlEncodeDotNet(null as any);
      }.should.throw());
      (function() {
        urlEncodeDotNet((() => {}) as any);
      }.should.throw());
      (function() {
        urlEncodeDotNet(new String("abc") as any);
      }.should.throw());
    });
  });
});

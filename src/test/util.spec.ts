import { urlEncodeDotNet } from "../";
require("should");
describe("util.ts", () => {
  describe("urlEncodeDotNet", () => {
    it("success", () => {
      urlEncodeDotNet("abc123ABC-_<>?/|{}[]()!@#$%^&*~`\"'=+").should.equal(
        "abc123abc-_%3c%3e%3f%2f%7c%7b%7d%5b%5d()!%40%23%24%25%5e%26*%7e%60%22%27%3d%2b"
      );
    });
    it("input is not string", () => {
      (function () {
        urlEncodeDotNet(0 as any);
      }.should.throw());
      (function () {
        urlEncodeDotNet({} as any);
      }.should.throw());
      (function () {
        urlEncodeDotNet(true as any);
      }.should.throw());
      (function () {
        urlEncodeDotNet(null as any);
      }.should.throw());
      (function () {
        urlEncodeDotNet((() => {}) as any);
      }.should.throw());
      (function () {
        urlEncodeDotNet(new String("abc") as any);
      }.should.throw());
    });
  });
});

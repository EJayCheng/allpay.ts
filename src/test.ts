import { OPayConfig, OPay } from "./";
let config = new OPayConfig();
let oPay = new OPay(config);

let html = oPay.getCheckOutFormHTML({
  MerchantTradeNo: "MerchantTradeNo000001",
  TotalAmount: 16888,
  ItemName: "商品名稱",
  ReturnURL: "http://ay.gosu.bar:3000",
  TradeDesc: "商品敘述"
});
console.log(html);

import { OPayConfig, OPay, generateMerchantTradeNo } from "./";
import * as express from "express";
let app = express();
let config = new OPayConfig();
let oPay = new OPay(config);

app.get("/create_order", (req, res) => {
  let p = oPay.checkout({
    TotalAmount: 16888,
    ItemName: "商品名稱",
    ReturnURL: "http://ay.gosu.bar:3000",
    TradeDesc: "商品敘述"
  });
  console.log(p);
  res.send(p.html);
});

app.listen(3000, () => console.log("http listening on port 3000"));

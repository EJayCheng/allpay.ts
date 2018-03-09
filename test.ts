import { OPayConfig, OPay, generateMerchantTradeNo } from "./src";
import * as express from "express";
import * as bodyParser from "body-parser";
let app = express();
let config = new OPayConfig();
let oPay = new OPay(config);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/create_order", (req, res) => {
  let p = oPay.checkout(
    {
      TotalAmount: 88,
      ItemName: "商品名稱",
      ReturnURL: "http://ay.gosu.bar/return_post",
      TradeDesc: "商品敘述"
    },
    {
      Remark: "by oPay.ts"
    }
  );
  res.contentType("html").send(p.html);
});

app.post(
  "/return_post",
  oPay.returnPostHandler(
    params => {
      console.log("return_post:", params);
      return true;
    },
    err => {
      console.log("err:", err);
    }
  )
);

app.listen(80, () => console.log("\nhttps://ay.gosu.bar/create_order\n"));

// oPay
//   .queryTradeInfo({ MerchantTradeNo: "TN1519805161935RFW4S" })
//   .then(console.log)
//   .catch(console.log);

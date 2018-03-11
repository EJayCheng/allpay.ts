import { OPayConfig, OPay, generateMerchantTradeNo } from "./src";
import * as express from "express";
import * as bodyParser from "body-parser";
let dns = "https://ay.gosu.bar/";
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
      ReturnURL: `${dns}return_post`,
      TradeDesc: "商品敘述"
    },
    {
      Remark: "by oPay.ts",
      PaymentInfoURL: `${dns}payment_info_post`
    }
  );
  res.contentType("html").send(p.html);
});

app.post(
  "/payment_info_post",
  oPay.paymentInfoPostHandler(
    async params => {
      console.log("payment_info_post:", params);
      return true;
    },
    err => {
      console.log("err:", err);
    }
  )
);

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
app.get("/", (req, res, next) => {
  res.send(`${Date.now()}`);
});

app.listen(80, () => console.log(`\n${dns}create_order\n`));

// oPay
//   .queryTradeInfo({ MerchantTradeNo: "TN1519805161935RFW4S" })
//   .then(console.log)
//   .catch(console.log);

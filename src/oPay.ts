import { IOPayConfig, OPayConfig } from "./config";
import { ICheckOutMust, ICheckOutOption } from "./ICheckOut";
import { IReturnPost } from "./IReturnPost";
import { ITradeInfo } from "./ITradeInfo";
import { extend } from "lodash";
import * as moment from "moment";
import * as request from "request-promise";
import * as qs from "querystring";
import {
  getMacValue,
  getPostFormHTML,
  verifyMacValue,
  generateMerchantTradeNo
} from "./util";
import { Verification as V } from "./verification";
import { IPaymentInfo } from "./IPaymentInfo";
export class OPay {
  public constructor(private config: IOPayConfig) {}

  /**
   * #### 產生 O’Pay 訂單 Form HTML
   * default parameters:
   * - EncryptType: 1
   * - ChoosePayment: "ALL"
   * - MerchantID: [config.MerchantID]
   * - MerchantTradeDate: [now]
   * - PaymentType: "aio"
   * #### response: html string
   */
  public checkout(must: ICheckOutMust, option?: ICheckOutOption) {
    let body: ICheckOutMust & ICheckOutOption = extend(
      {
        MerchantTradeNo: generateMerchantTradeNo(),
        EncryptType: 1,
        ChoosePayment: "ALL",
        MerchantID: this.config.MerchantID,
        MerchantTradeDate: moment().format("YYYY/MM/DD HH:mm:ss"),
        PaymentType: "aio"
      },
      option,
      must
    );
    let check = new V();
    check.verify(body, {
      EncryptType: [V.equal(1)],
      PaymentType: [V.equal("aio")],
      MerchantTradeDate: [V.isMatch(/^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/)],
      TotalAmount: [V.isNumber, V.minValue(1), V.isInteger],
      MerchantID: [V.isString, V.limitLength(1, 10)],
      MerchantTradeNo: [
        V.isString,
        V.limitLength(1, 20),
        V.isNumberOrEnglishLetter
      ],
      TradeDesc: [V.isString, V.limitLength(1, 200)],
      ItemName: [V.isString, V.limitLength(1, 200)],
      ReturnURL: [V.isString, V.isUrl, V.limitLength(1, 200)],
      ChoosePayment: [
        V.includes<string>([
          "Credit",
          "WebATM",
          "ATM",
          "CVS",
          "AccountLink",
          "TopUpUsed",
          "ALL"
        ])
      ]
    });
    if (check.invalid) throw check.errorMessage;
    body.CheckMacValue = getMacValue(body, this.config);
    return {
      params: body,
      html: getPostFormHTML(this.config.AioCheckOutUrl, body)
    };
  }

  /**
   * #### 當消費者付款完成後，express server 接收 oPay 的付款結果的 webhook
   *
   */
  public returnPostHandler(
    /** CheckMacValue 驗證成功後的對應處理 */
    successEvent: (params: IReturnPost) => boolean | Promise<boolean>,
    /** 錯誤處理 */
    errorEvent?: (err: string) => void | Promise<void>
  ) {
    if (typeof successEvent != "function")
      throw "Error returnPostHandler: successEvent must be function.";
    return async (req, res, next) => {
      try {
        let isLegal = verifyMacValue(req.body, this.config);
        if (!isLegal) throw "CheckMacValue 驗證錯誤";
        if (
          typeof successEvent == "function" &&
          (await successEvent(req.body))
        ) {
          res.send("1|OK");
          return;
        }
        throw "付款通知處理失敗";
      } catch (err) {
        res.send(`0|${err}`);
        if (typeof errorEvent == "function") errorEvent(err);
      }
    };
  }
  /**
   * 提供會員系統查詢 O'Pay 訂單資訊，可透過此 API 來過濾是否為有效訂單，更多應用請參考 [FAQ](https://forum.allpay.com.tw/forum.php?mod=viewthread&tid=95&extra=page%3D1)
   */
  public async queryTradeInfo(info: ITradeInfo) {
    let body = extend<ITradeInfo>(
      {
        TimeStamp: Math.floor(Date.now() / 1000),
        MerchantID: this.config.MerchantID,
        PlatformID: ""
      },
      info
    );
    let check = new V();
    check.verify(body, {
      TimeStamp: [V.isNumber],
      MerchantID: [V.isString, V.limitLength(1, 10)],
      MerchantTradeNo: [
        V.isString,
        V.limitLength(1, 20),
        V.isNumberOrEnglishLetter
      ]
    });
    if (check.invalid) throw check.errorMessage;
    body.CheckMacValue = getMacValue(body, this.config);
    let data = qs.stringify(body);
    return request
      .post(this.config.QueryTradeInfoUrl, {
        form: body,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(data)
        },
        json: false
      })
      .then(qs.parse);
  }

  public paymentInfoPostHandler(
    /** CheckMacValue 驗證成功後的對應處理 */
    successEvent: (params: IPaymentInfo) => boolean | Promise<boolean>,
    /** 錯誤處理 */
    errorEvent?: (err: string) => void | Promise<void>
  ) {
    if (typeof successEvent != "function")
      throw "Error paymentInfoPostHandler: successEvent must be function.";
    return async (req, res, next) => {
      try {
        let isLegal = verifyMacValue(req.body, this.config);
        if (!isLegal) throw "CheckMacValue 驗證錯誤";
        if (
          typeof successEvent == "function" &&
          (await successEvent(req.body))
        ) {
          res.send("1|OK");
          return;
        }
        throw "付款方法通知處理失敗";
      } catch (err) {
        res.send(`0|${err}`);
        if (typeof errorEvent == "function") errorEvent(err);
      }
    };
  }
}

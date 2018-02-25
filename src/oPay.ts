import { IOPayConfig, OPayConfig } from "./config";
import { ICheckOutMust, ICheckOutOption } from "./ICheckOut";
import * as request from "request-promise";
import { extend } from "lodash";
import * as moment from "moment";
import { getMacValue, getPostFormHTML } from "./util";
import { Verification as V } from "./verification";
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
   *
   * #### response: html string
   */
  public getCheckOutFormHTML(must: ICheckOutMust, option?: ICheckOutOption) {
    let body: any = extend(
      {
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
      MerchantTradeNo: [V.isString, V.limitLength(1, 20)],
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
    return getPostFormHTML(this.config.AioCheckOutUrl, body);
  }
}

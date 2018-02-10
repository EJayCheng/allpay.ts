import { IOPayConfig } from "./config";
import { ICheckOutMust, ICheckOutOption } from "./checkOut";
import * as request from "request-promise";
import { extend } from "lodash";
import * as moment from "moment";
export class OPay {
  public constructor(private config: IOPayConfig) {}

  /** 產生 O’Pay 訂單: 消費者在會員系統進行購物後送出訂單 */
  public AioCheckOut(must: ICheckOutMust, option?: ICheckOutOption) {
    let body: any = {
      EncryptType: 1,
      ChoosePayment: "ALL",
      MerchantID: this.config.MerchantID,
      MerchantTradeDate: moment().format("YYYY/MM/dd HH:mm:ss"),
      PaymentType: "aio"
    };
    must.PaymentType;
    request.post(this.config.AioCheckOutUrl, {
      body
    });
  }
}

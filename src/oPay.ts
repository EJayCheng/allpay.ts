import { Request, Response } from "express";
import { extend } from "lodash";
import * as moment from "moment";
import { parse, stringify } from "querystring";
import { post } from "request-promise";
import { IOPayConfig } from "./config";
import { ICheckOutMust, ICheckOutOption } from "./ICheckOut";
import { IPaymentInfo } from "./IPaymentInfo";
import { IReturnPost } from "./IReturnPost";
import { ITradeInfo } from "./ITradeInfo";
import { getMacValue, toPostFormHtml, verifyMacValue } from "./util";
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
  public checkout(
    must: ICheckOutMust,
    option?: ICheckOutOption
  ): { params: ICheckOutMust & ICheckOutOption; html: string } {
    let body: ICheckOutMust & ICheckOutOption = extend(
      {
        EncryptType: 1,
        ChoosePayment: "ALL",
        MerchantID: this.config.MerchantID,
        MerchantTradeDate: moment().format("YYYY/MM/DD HH:mm:ss"),
        PaymentType: "aio",
      },
      option,
      must
    );
    body.CheckMacValue = getMacValue(body, this.config);
    return {
      params: body,
      html: toPostFormHtml(this.config.AioCheckOutUrl, body),
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
    errorEvent?: (err: string, reqBody: any) => void | Promise<void>
  ): (req: Request, res: Response) => Promise<void> {
    if (typeof successEvent != "function") {
      throw "Error returnPostHandler: successEvent must be function.";
    }
    return async (req: Request, res: Response) => {
      try {
        let isLegal = verifyMacValue(req.body, this.config);
        if (!isLegal) throw "CheckMacValue 驗證錯誤";
        if (await successEvent(req.body)) {
          res.send("1|OK");
          return;
        }
        throw "付款通知處理失敗";
      } catch (err) {
        res.send(`0|${err}`);
        if (typeof errorEvent == "function") errorEvent(err, req.body);
      }
    };
  }
  /**
   * 提供會員系統查詢 O'Pay 訂單資訊，可透過此 API 來過濾是否為有效訂單，更多應用請參考 [FAQ](https://forum.allpay.com.tw/forum.php?mod=viewthread&tid=95&extra=page%3D1)
   */
  public async queryTradeInfo(info: ITradeInfo) {
    let body = extend(
      <ITradeInfo>{
        TimeStamp: Math.floor(Date.now() / 1000),
        MerchantID: this.config.MerchantID,
        PlatformID: "",
      },
      info
    );
    body.CheckMacValue = getMacValue(body, this.config);
    let data = stringify(body as any);
    return post(this.config.QueryTradeInfoUrl, {
      form: body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(data),
      },
      json: false,
    }).then(parse);
  }

  public paymentInfoPostHandler(
    /** CheckMacValue 驗證成功後的對應處理 */
    successEvent: (params: IPaymentInfo) => boolean | Promise<boolean>,
    /** 錯誤處理 */
    errorEvent?: (err: string, reqBody: any) => void | Promise<void>
  ): (req: Request, res: Response) => Promise<void> {
    if (typeof successEvent != "function") {
      throw "Error paymentInfoPostHandler: successEvent must be function.";
    }
    return async (req: Request, res: Response) => {
      try {
        let isLegal = verifyMacValue(req.body, this.config);
        if (!isLegal) throw "CheckMacValue 驗證錯誤";
        if (await successEvent(req.body)) {
          res.send("1|OK");
          return;
        }
        throw "付款方法通知處理失敗";
      } catch (err) {
        res.send(`0|${err}`);
        if (typeof errorEvent == "function") errorEvent(err, req.body);
      }
    };
  }
}

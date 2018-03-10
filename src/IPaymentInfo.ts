import { TPaymentType } from "./IReturnPost";
//** ATM、CVS 的取號結果通知 */
export interface IPaymentInfo {
  /**
   * 會員編號 (由 O’Pay 提供)
   */
  MerchantID: string;
  /**
   * 會員交易編號(由會員提供)
   * 1. 會員交易編號均為唯一值，不可重複使用。
   * 2. 英數字大小寫混合
   * 3. 如何避免訂單編號重複請參考 [FAQ](https://forum.opay.tw/forum.php?mod=viewthread&tid=127&extra=page%3D1)
   * 4. 如有使用 PlatformID，平台商底下所有商家之訂單編號亦不可重複。
   */
  MerchantTradeNo: string;
  /** 會員商店代碼 */
  StoreID: string;
  /** 交易狀態，若回傳值為 1 時，為付款成功; 其餘代碼皆為交易失敗，請勿出貨。 */
  RtnCode: string;
  /** 交易訊息，ex: 交易成功 */
  RtnMsg: string;
  /** O’Pay 的交易編號，請保存 O’Pay 的交易編號與會員交易編號[MerchantTradeNo]的關連。 */
  TradeNo: string;
  /** 交易總金額 = 實際付款金額[PayAmt] + 折抵金額[RedeemAmt] */
  TradeAmt: string;
  /**
   * 實際付款金額 = 交易金額[TradeAmt] - 折抵金額[RedeemAmt]
   *
   * 注意事項:
   * 1. 若為模擬付款時不會回傳此欄位
   * 2. 若建立訂單 UseRedeem = Y 時，才會回傳此欄位
   */
  PayAmt: string;
  /**
   * 使用購物金折抵的金額
   *
   * 注意事項:
   * 1. 若為模擬付款時不會回傳此欄位
   * 2. 若建立訂單 UseRedeem = Y 時，才會回傳此欄位
   */
  RedeemAmt: string;
  /** 付款時間，格式為 yyyy/MM/dd HH:mm:ss */
  PaymentDate: string;
  /** 會員選擇的付款方式 */
  PaymentType: TPaymentType;
  /** 訂單成立時間，格式為 yyyy/MM/dd HH:mm:ss */
  TradeDate: string;
  /** 條碼第一段號碼 */
  Barcode1: string;
  /** 條碼第二段號碼 */
  Barcode2: string;
  /** 條碼第三段號碼 */
  Barcode3: string;
  /** 檢查碼 */
  CheckMacValue: string;
  /** 繳費期限 YYYY/MM/dd (HH:mm:ss) */
  ExpireDate: string;
  /** ATM 繳費銀行代碼 */
  BankCode?: string;
  /** ATM 繳費虛擬帳號 */
  vAccount?: string;
  /** CVS 繳費代碼 */
  PaymentNo?: string;
}

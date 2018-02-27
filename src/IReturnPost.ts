export type TPaymentType =
  /** 台新銀行 WebATM */
  | "WebATM_TAISHIN"
  /** 兆豐銀行 WebATM */
  | "WebATM_MEGA"
  /** 新光銀行 WebATM */
  | "WebATM_SHINKONG"
  /** 第一銀行 WebATM */
  | "WebATM_FIRST"
  /** 玉山銀行 ATM */
  | "ATM_ESUN"
  /** 第一銀行 ATM */
  | "ATM_FIRST"
  /** 中國信託 ATM */
  | "ATM_CHINATRUST"
  /** 台新銀行 ATM */
  | "ATM_TAISHIN"
  /** 超商代碼繳款 */
  | "CVS_CVS"
  /** OK 超商代碼繳款 */
  | "CVS_OK"
  /** 全家超商代碼繳款 */
  | "CVS_FAMILY"
  /** 萊爾富超商代碼繳款 */
  | "CVS_HILIFE"
  /** 7-11 ibon 代碼繳款 */
  | "CVS_IBON"
  /** 銀行快付_台新銀行 */
  | "AccountLink_TAISHIN"
  /** 信用卡*/
  | "Credit_CreditCard"
  /** 儲值/餘額消費_歐付寶 */
  | "TopUpUsed_AllPay";

export interface IReturnPost {
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
  RtnCode: number;
  /** 交易訊息，ex: 交易成功 */
  RtnMsg: string;
  /** O’Pay 的交易編號，請保存 O’Pay 的交易編號與會員交易編號[MerchantTradeNo]的關連。 */
  TradeNo: string;
  /** 交易總金額 = 實際付款金額[PayAmt] + 折抵金額[RedeemAmt] */
  TradeAmt: number;
  /**
   * 實際付款金額 = 交易金額[TradeAmt] - 折抵金額[RedeemAmt]
   *
   * 注意事項:
   * 1. 若為模擬付款時不會回傳此欄位
   * 2. 若建立訂單 UseRedeem = Y 時，才會回傳此欄位
   */
  PayAmt: number;
  /**
   * 使用購物金折抵的金額
   *
   * 注意事項:
   * 1. 若為模擬付款時不會回傳此欄位
   * 2. 若建立訂單 UseRedeem = Y 時，才會回傳此欄位
   */
  RedeemAmt: number;
  /** 付款時間，格式為 yyyy/MM/dd HH:mm:ss */
  PaymentDate: string;
  /** 會員選擇的付款方式 */
  PaymentType: TPaymentType;
  /** 通路費(手續費) */
  PaymentTypeChargeFee: number;
  /** 訂單成立時間，格式為 yyyy/MM/dd HH:mm:ss */
  TradeDate: string;
  /**
   * 是否為模擬付款
   * - 若為 1 時，代表此交易為模擬付款，請勿出貨。
   * - 若為 0 時，代表此交易非模擬付款。
   *
   * 注意事項: 會員可透過廠商後台網站來針對單筆訂單模擬歐付寶回傳付款通知，以方便介接 API 的測試。
   */
  SimulatePaid: number;
  /** 檢查碼 */
  CheckMacValue: string;
}

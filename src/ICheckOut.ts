export type TChoosePayment =
  | "Credit"
  | "WebATM"
  | "ATM"
  | "CVS"
  | "AccountLink"
  | "TopUpUsed"
  | "ALL";
export interface ICheckOutMust {
  /**
   * 會員編號 (由 O’Pay 提供)
   */
  MerchantID?: string;
  /**
   * 會員交易編號(由會員提供)
   * 1. 會員交易編號均為唯一值，不可重複使用。
   * 2. 英數字大小寫混合
   * 3. 如何避免訂單編號重複請參考 [FAQ](https://forum.opay.tw/forum.php?mod=viewthread&tid=127&extra=page%3D1)
   * 4. 如有使用 PlatformID，平台商底下所有商家之訂單編號亦不可重複。
   */
  MerchantTradeNo: string;
  /** 會員交易時間, 格式為: yyyy/MM/dd HH:mm:ss */
  MerchantTradeDate?: string;
  /** 交易類型, 請固定填入 aio */
  PaymentType?: "aio";
  /**
   * 交易金額
   * - 請帶整數，不可有小數點
   * - 僅限新台幣，金額不可為 0 元
   * - CVS 最低限制為 27 元，最高限制為 20000 元
   * - 信用卡金額若非特店會員及第三類個人/商務鑽石(議約)，金額不可小於 5 元
   */
  TotalAmount: number;
  /** 交易描述 */
  TradeDesc: string;
  /** 商品名稱 */
  ItemName: string;
  /**
   * 付款完成通知回傳網址
   *
   * 當消費者付款完成後，歐付寶會將付款結果參數以幕後(Server POST)回傳到該網址。
   * - 請勿設定與 Client 端接收付款結果網址 OrderResultURL 相同位置，避免程式判斷錯誤。
   * - 請在收到 Server 端付款結果通知後，請正確回應 1|OK 給歐付寶
   */
  ReturnURL: string;
  /**
   * 選擇預設付款方式:
   * - Credit: 信用卡
   * - WebATM: 網路 ATM，手機版時不支援。
   * - ATM: 自動櫃員機
   * - CVS: 超商代碼
   * - AccountLink: 銀行快付
   * - TopUpUsed: 儲值消費
   * - ALL: 不指定付款方式，由歐付寶顯示付款方式選擇頁面。
   */
  ChoosePayment?: TChoosePayment;
  /** 檢查碼 */
  CheckMacValue?: string;
  /** CheckMacValue 加密類型， 請固定填入 1，使用 SHA256 加密。 */
  EncryptType?: 1;
}

export interface ICheckOutOption {
  /** 會員商店代碼， */
  StoreID?: string;
  /**
   * Client 端返回會員系統的按鈕連結
   *
   * 消費者點選此按鈕後，會將頁面導回到此設定的網址
   *
   * 注意事項:
   * - 導回時不會帶付款結果到此網址，只是將頁面導回而已。
   * - 設定此參數，歐付寶會在付款完成或取號完成頁面上顯示[返回商店]的按鈕。
   * - 設定此參數，發生簡訊 OTP 驗證失敗時，頁面上會顯示[返回商店]的按鈕。
   * - 若未設定此參數，則歐付寶付款完成頁或取號完成頁面，不會顯示[返回商店]的按鈕。
   * - 若導回網址未使用 https 時，部份瀏覽器可能會出現警告訊息。
   */
  ClientBackURL?: string;
  /**
   * Client 端回傳付款結果網址
   *
   * 為付款完成後，歐付寶將頁面導回到會員網址，並將付款結果帶回
   *
   * 注意事項:
   * - 沒帶此參數則會顯示歐付寶的付款完成頁。
   * - 如果要將付款結果頁顯示在會員系統內，請設定此參數。
   * - 若設定此參數，將會使設定的 Client 端返回會員系統的按鈕連結[ClientBackURL]失效。
   * - 部分銀行 WebATM 在交易成功後，會停留在銀行的頁面，並不會導回給歐付寶，所以歐付寶也不會將頁面導回到[OrderResultURL]的頁。
   * - 非即時交易(ATM、CVS)不支援此參數。
   * - 建議在測試階段時先不要設定此參數，可將畫面停留在歐付寶，看見歐付寶所提供的錯誤訊息，便可以有效除錯。
   * - 若有設定此參數，請務必根據回傳的交易狀態來判斷顯示付款成功與否的頁面。
   * - 若導回網址未使用 https 時，部份瀏覽器可能會出現警告訊息。
   */
  OrderResultURL?: string;
  /** 商品銷售網址 */
  ItemURL?: string;
  /** 備註欄位 */
  Remark?: string;
  /**
   * 隱藏付款方式，當付款方式[ChoosePayment]為 ALL 時，可隱藏不需要的付款方式，多筆請以井號分隔(#)。
   * - Credit: 信用卡
   * - WebATM: 網路 ATM
   * - ATM: 自動櫃員機
   * - CVS: 超商代碼
   * - AccountLink: 銀行快付
   * - TopUpUsed: 儲值消費
   */
  IgnorePayment?: string;
  /** 裝置來源 */
  DeviceSource?: "" | "APP";
}

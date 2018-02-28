export interface ITradeInfo {
  /**
   * 會員編號 (由 O’Pay 提供)
   */
  MerchantID?: string;
  /**
   * 會員交易編號(由會員提供)
   *
   * 訂單產生時傳送給 O’Pay 的會員交易編號。
   */
  MerchantTradeNo: string;
  /**
   * 專案合作的平台商使用
   * - 一般會員或平台商本身介接，則參數請帶放空值
   * - 若為專案合作平台商的會員使用時，則參數請帶平台商所綁的會員編號[MerchantID]
   */
  PlatformID?: string;
  /**
   * 將當下的時間轉為 UnixTimeStamp 用於驗證此次介接的時間區間
   *
   * 歐付寶驗證時間區間暫訂為 3 分鐘內有效，超過則此次介接無效。
   *
   * [參考資料](http://www.epochconverter.com/)
   */
  TimeStamp?: number;
  /** 檢查碼 */
  CheckMacValue?: string;
}

export interface ICheckOutMust {
  /** 
   * 會員編號 (由 O’Pay 提供)
   */
  MerchantID: string,
  /** 
   * 會員交易編號(由會員提供)  
   * 1. 會員交易編號均為唯一值，不可重複使用。  
   * 2. 英數字大小寫混合  
   * 3. 如何避免訂單編號重複請參考 [FAQ](https://forum.opay.tw/forum.php?mod=viewthread&tid=127&extra=page%3D1)
   * 4. 如有使用 PlatformID，平台商底下所有商家之訂單編號亦不可重複。
   */
  MerchantTradeNo: string,
  /** 會員交易時間, 格式為: yyyy/MM/dd HH:mm:ss */
  MerchantTradeDate: string,
  /** 交易類型, 請固定填入 aio */
  PaymentType?: 'aio',
  /** 
   * 交易金額
   * - 請帶整數，不可有小數點
   * - 僅限新台幣，金額不可為 0 元
   * - CVS 最低限制為 27 元，最高限制為 20000 元
   * - 信用卡金額若非特店會員及第三類個人/商務鑽石(議約)，金額不可小於 5 元  
  */
  TotalAmount: number
}
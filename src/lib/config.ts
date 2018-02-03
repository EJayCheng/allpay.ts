export interface IOPayConfig {
  /** 會員編號 */
  MerchantID: string,
  /** ALL IN ONE 介接 HashKey */
  HashKey: string,
  /** ALL IN ONE 介接 HashIV */
  HashIV: string,

}
export class OPayConfig implements IOPayConfig {
  public AioCheckOutUrl = "https://payment.opay.tw/Cashier/AioCheckOut/V4";
  public ipWhitelist: string[] = [
    "60.199.179.34",
    "60.199.179.36",
    "60.199.179.37",
    "60.199.179.38",
    "60.199.179.53"
  ]
  public constructor(
    /** 會員編號 */
    public MerchantID: string,
    /** ALL IN ONE 介接 HashKey */
    public HashKey: string,
    /** ALL IN ONE 介接 HashIV */
    public HashIV: string
  ) { }
}

export class DevOPayConfig implements IOPayConfig {

}


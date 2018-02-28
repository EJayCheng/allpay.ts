export interface IOPayConfig {
  /**
   * 會員編號 (由 O’Pay 提供)
   * - 正式環境 MerchantID 取得 [FAQ](https://forum.opay.tw/forum.php?mod=viewthread&tid=135&extra=page%3D1)
   */
  MerchantID: string;
  /** ALL IN ONE 介接 HashKey */
  AIOHashKey: string;
  /** ALL IN ONE 介接 HashIV */
  AIOHashIV: string;
  /** 電子發票 介接 HashKey */
  InvoiceHashKey?: string;
  /** 電子發票 介接 HashIV */
  InvoiceHashIV?: string;
  /** [POST]產生 O’Pay 訂單 */
  AioCheckOutUrl: string;
  /** [POST]查詢 O’Pay 訂單 */
  QueryTradeInfoUrl: string;
}
export class OPayConfig implements IOPayConfig {
  private devEnv: string = "";
  public QueryTradeInfoUrl: string;
  public AioCheckOutUrl: string;
  /** oPay webhook ip 安全白名單 */
  public ipWhitelist: string[] = [
    "60.199.179.34",
    "60.199.179.36",
    "60.199.179.37",
    "60.199.179.38",
    "60.199.179.53"
  ];
  public constructor(
    /** 會員編號 (由 O’Pay 提供), 預設使用測試環境(2000132) */
    public MerchantID: string = "2000132",
    /** ALL IN ONE 介接 HashKey, 預設使用測試環境(5294y06JbISpM5x9) */
    public AIOHashKey: string = "5294y06JbISpM5x9",
    /** ALL IN ONE 介接 HashIV, 預設使用測試環境(v77hoKGq4kWxNNIS) */
    public AIOHashIV: string = "v77hoKGq4kWxNNIS"
  ) {
    //判斷是否為測試環境
    if (["2012441", "2000132"].indexOf(this.MerchantID) != -1)
      this.devEnv = "-stage";
    this.AioCheckOutUrl = `https://payment${
      this.devEnv
    }.opay.tw/Cashier/AioCheckOut/V4`;
    this.QueryTradeInfoUrl = `https://payment${
      this.devEnv
    }.opay.tw/Cashier/QueryTradeInfo/V4`;
  }
}

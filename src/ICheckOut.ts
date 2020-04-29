export type TChoosePayment =
  | "Credit"
  | "WebATM"
  | "ATM"
  | "CVS"
  | "AccountLink"
  | "TopUpUsed"
  | "WeiXinpay"
  | "ALL";
export type TIgnorePayment =
  | "Credit"
  | "WebATM"
  | "ATM"
  | "CVS"
  | "AccountLink"
  | "TopUpUsed";
export type TChooseSubPayment =
  | "TAISHIN"
  | "SHINKONG"
  | "FIRST"
  | "MEGA"
  | "ESUN"
  | "CHINATRUST"
  | "CVS"
  | "OK"
  | "FAMILY"
  | "HILIFE"
  | "IBON"
  | "AccountLink"
  | "Credit"
  | "AllPay";

export type YesOrNo = "N" | "Y";
export interface ICheckOutMust {
  /**
   * 會員編號 (由 O’Pay 提供)
   * - 最大字數 10
   */
  MerchantID?: string;
  /**
   * 會員交易編號(由會員提供)
   * - 會員交易編號均為唯一值，不可重複使用
   * - 英數字大小寫混合
   * - 如何避免訂單編號重複請參考 [FAQ](https://forum.opay.tw/forum.php?mod=viewthread&tid=127&extra=page%3D1)
   * - 如有使用 PlatformID，平台商底下所有商家之訂單編號亦不可重複
   * - 當[ChoosePayment]為 WeiXinpay(微信支付)時，MerchantTradeNo 僅支援 32 位元。若超過此限制，則無法顯示微信付款 QRCode 資訊。
   * - 最大字數 64 or 32
   */
  MerchantTradeNo: string;
  /**
   * 會員交易時間
   * - 格式為: YYYY/MM/dd HH:mm:ss
   * - 最大字數 20
   */
  MerchantTradeDate?: string;
  /**
   * 交易類型
   * - 請固定填入 aio
   * - 最大字數 20
   */
  PaymentType?: "aio";
  /**
   * 交易金額
   * - 請帶整數，不可有小數點
   * - 僅限新台幣，金額不可為 0 元
   * - CVS 最低限制為 27 元，最高限制為 20000 元
   * - 信用卡金額若非特店會員及第三類個人/商務鑽石(議約)，金額不可小於 5 元
   */
  TotalAmount: number;
  /**
   * 交易描述
   * - 最大字數 200
   */
  TradeDesc: string;
  /**
   * 商品名稱
   * - 最大字數 200
   * - 如果商品名稱有多筆，需在金流選擇頁一行一行顯示商品名稱的話，商品名稱請以符號#分隔
   * - 若付款方式選擇[微信支付]，必須依照範例格式帶入【商品名稱 1 單價 X 數量#商品名稱 2 單價 X 數量】，且字數限制為 40 個英數字或中文字。
   * - 為避免建立訂單失敗，字數超出長度限制系統將會自動截斷。
   */
  ItemName: string;
  /**
   * 付款完成通知回傳網址
   *
   * 當消費者付款完成後， oPay 會將付款結果參數以幕後(Server POST)回傳到該網址
   * - 請勿設定與 Client 端接收付款結果網址 OrderResultURL 相同位置，避免程式判斷錯誤
   * - 請在收到 Server 端付款結果通知後，請正確回應 1|OK 給 oPay
   * - 僅接受 http 80 port 與 https 443 port
   * - 最大字數 200
   */
  ReturnURL: string;
  /**
   * 選擇預設付款方式:
   * - Credit: 信用卡
   * - WebATM: 網路 ATM，手機版時不支援
   * - ATM: 自動櫃員機
   * - CVS: 超商代碼
   * - AccountLink: 銀行快付
   * - TopUpUsed: 儲值消費
   * - WeiXinpay: 微信支付
   * - ALL: 不指定付款方式，由 oPay 顯示付款方式選擇頁面
   * - 最大字數 20
   * - 若為手機版時不支援下列付款方式: WebATM
   * - 微信支付目前無法提供交易測試的回應，預計未來會再提供。
   * - 微信支付繳費期限為 2 小時，請務必於期限內進行付款。
   */
  ChoosePayment?: TChoosePayment;
  /** 檢查碼 */
  CheckMacValue?: string;
  /**
   * CheckMacValue 加密類型
   * - 請固定填入 1
   * - 使用 SHA256 加密
   */
  EncryptType?: 1;
}

export interface ICheckOutOption {
  /**
   * 會員商店代碼
   * - 最大字數 20
   */
  StoreID?: string;
  /**
   * Client 端返回會員系統的按鈕連結
   *
   * 消費者點選此按鈕後，會將頁面導回到此設定的網址
   *
   * 注意事項:
   * - 導回時不會帶付款結果到此網址，只是將頁面導回而已
   * - 設定此參數， oPay 會在付款完成或取號完成頁面上顯示[返回商店]的按鈕
   * - 設定此參數，發生簡訊 OTP 驗證失敗時，頁面上會顯示[返回商店]的按鈕
   * - 若未設定此參數，則 oPay 付款完成頁或取號完成頁面，不會顯示[返回商店]的按鈕
   * - 若導回網址未使用 https 時，部份瀏覽器可能會出現警告訊息
   * - 最大字數 20
   */
  ClientBackURL?: string;
  /**
   * Client 端回傳付款結果網址
   *
   * 為付款完成後， oPay 將頁面導回到會員網址，並將付款結果帶回
   *
   * 注意事項:
   * - 沒帶此參數則會顯示 oPay 的付款完成頁
   * - 如果要將付款結果頁顯示在會員系統內，請設定此參數
   * - 若設定此參數，將會使設定的 Client 端返回會員系統的按鈕連結[ClientBackURL]失效
   * - 部分銀行 WebATM 在交易成功後，會停留在銀行的頁面，並不會導回給 oPay ，所以 oPay 也不會將頁面導回到[OrderResultURL]的頁
   * - 非即時交易(ATM、CVS)不支援此參數
   * - 建議在測試階段時先不要設定此參數，可將畫面停留在 oPay ，看見 oPay 所提供的錯誤訊息，便可以有效除錯
   * - 若有設定此參數，請務必根據回傳的交易狀態來判斷顯示付款成功與否的頁面
   * - 若導回網址未使用 https 時，部份瀏覽器可能會出現警告訊息
   * - 僅接受 http 80 port 與 https 443 port
   * - 最大字數 200
   */
  OrderResultURL?: string;
  /**
   * 商品銷售網址
   * - 最大字數 200
   */
  ItemURL?: string;
  /**
   * 備註欄位
   * - 最大字數 200
   */
  Remark?: string;
  /**
   * 隱藏付款方式，當付款方式[ChoosePayment]為 ALL 時，可隱藏不需要的付款方式，多筆請以井號分隔(#)
   * - Credit: 信用卡
   * - WebATM: 網路 ATM
   * - ATM: 自動櫃員機
   * - CVS: 超商代碼
   * - AccountLink: 銀行快付
   * - TopUpUsed: 儲值消費
   */
  IgnorePayment?: TIgnorePayment;
  /** 裝置來源 */
  DeviceSource?: "" | "APP";
  /**
   * 允許繳費有效天數
   * - 若需設定 1 ~ 60 天
   * - 未設定此參數則預設為 3 天
   * - 單位為天
   * - 適用於 ChoosePayment 為 ALL | ATM
   */
  ExpireDate?: number;
  /**
   * Server 端回傳付款相關資訊
   *
   * 若有設定此參數，訂單建立完成後(非付款完成)，oPay 將回傳消費者付款方式相關資訊(例:銀行代碼、繳費虛擬帳號繳費期限...等)
   * - 頁面將會停留在 oPay ，顯示繳費的相關資訊
   * - 適用於 ChoosePayment 為 ALL | ATM | CVS
   */
  PaymentInfoURL?: string;
  /**
   *  Client 端回傳付款相關資訊
   *
   * 若有設定此參數，訂單建立完成後(非付款完成)， oPay 會 Client 端回傳消費者付款方式相關資訊(例:銀行代碼、繳費虛擬帳號繳費期限...等)，且將頁面轉到會員系統指定的頁面，顯示繳費的相關資訊
   * - 若設定此參數，將會使設定的返回會員系統的按鈕連結[ClientBackURL]失效
   * - 若導回網址未使用 https 時，部份瀏覽器可能會出現警告訊息
   * - 最大字數 200
   * - 適用於 ChoosePayment 為 ALL | ATM | CVS
   */
  ClientRedirectURL?: string;
  /**
   *  付款子項目
   *
   *  若設定此參數，將視消費者是否已登入 oPay 做不同處理：
   *  1. 未登入，進入 oPay 付款選擇頁時，會依設定的付款方式及付款子項目帶入預設值，並可選擇其他付款子項目
   *  2. 已登入，進入 oPay 訂單成立頁時，會依設定的付款方式及付款子項目帶入訂單，無法選擇其他付款子項目
   */
  ChooseSubPayment?: TChooseSubPayment;
  /**
   * 是否需要額外的付款資訊
   *
   * 為 Y 時，付款完成後 oPay 會以 POST 方式回傳額外的付款資訊
   */
  NeedExtraPaidInfo?: YesOrNo;
  /**
   * 特約合作平台商代號(由 oPay 提供)
   * - 為專案合作的平台商使用，一般會員或平台商本身介接，則參數請帶放空值
   * - 若為專案合作平台商的會員使用時，則參數請帶平台商所綁的會員編號 [MerchantID]。
   * - 最大字數 10
   */
  PlatformID?: string;
  /**
   * 電子發票開立註記
   * - 此參數為付款完成後開立電子發票
   * - 若要使用時請將該參數設定為 Y
   * - 正式環境欲使用電子發票功能，須與 oPay 申請開通，若未開通請致電客服中心 (02)2655-0115
   */
  InvoiceMark?: "" | "Y";
  /**
   * 是否延遲撥款
   *
   * 買方付款完成後，oPay 依合約約定之時間，撥款給會員
   * - 若為不延遲撥款，請帶 0
   * - 若為延遲撥款，請帶 1，買方付款完成後，需再呼叫「會員申請撥款退款」API，讓 oPay 撥款給會員，或退款給買方。
   * - 倘若會員一直不申請撥款，此筆訂單款項會一直放在 oPay ，直到會員申請撥款
   * - 延遲撥款不適用「信用卡」之付款方式
   */
  HoldTradeAMT?: number;
  /**
   * 是否可以使用 購物金 / 紅包 折抵
   * - 若為可使用時，請帶 Y
   * - 若為不可使用時，請帶 N
   * - 折抵方式可於「廠商後台/紅包折抵設定」功能新增您的折抵條件
   * - 若已開啟折抵設定，需再配合此參數，來決定此筆交易是否可以使用購物金/紅包折抵。
   * - 配合折抵購物金/紅包會員， oPay 將協助進行免費曝光，折抵之金額，則由會員負擔
   * - 若可使用購物金/紅包折抵時，需注意接收付款結果通知時，請以交易金額 [TradeAmt] 做訂單金額的檢查。
   */
  UseRedeem?: YesOrNo;
  /**
   * 超商繳費截止時間
   * - CVS:若參數值 > 100 時，以 分鐘 為單位
   * - 若參數值 <= 100 時以 天 為單位
   * - 適用於 ChoosePayment 為 ALL | CVS
   */
  StoreExpireDate?: number;
  /**
   * 交易描述 1
   * - 會出現在超商繳費平台螢幕上
   * - 最大字數 20
   * - 適用於 ChoosePayment 為 ALL | CVS
   */
  Desc_1?: string;
  /**
   * 交易描述 2
   * - 會出現在超商繳費平台螢幕上
   * - 最大字數 20
   * - 適用於 ChoosePayment 為 ALL | CVS
   */
  Desc_2?: string;
  /**
   * 交易描述 3
   * - 會出現在超商繳費平台螢幕上
   * - 最大字數 20
   * - 適用於 ChoosePayment 為 ALL | CVS
   */
  Desc_3?: string;
  /**
   * 交易描述 4
   * - 會出現在超商繳費平台螢幕上
   * - 最大字數 20
   * - 適用於 ChoosePayment 為 ALL | CVS
   */
  Desc_4?: string;
  /**
   * 信用卡是否使用紅利折抵
   *
   * 當 oPay會員選擇信用卡付款時，會進入紅利折抵的交易流程
   * - 若為使用時，請帶 Y
   * - 若為不使用時，請帶 N
   */
  Redeem?: YesOrNo;
  /**
   * 刷卡分期期數
   * - 提供刷卡分期期數信用卡分期可用參數為 3,6,12,18,24
   * - 可使用的分期期數會以開通的分期數為主
   * - 以逗號分隔 ex: 3,6,12
   * - 不可以與信用卡定期定額參數一起設定
   * - 若使用分期付款功能，後續分期的款項會由銀行執行確認
   * - 欲在測試環境進行刷卡功能，請使用 oPay 提供的信用卡測試卡號進行模擬付款
   * - 串接時請帶訂單的刷卡分期的總付款金額，無須自行計算各分期金額，除不盡的金額銀行會於第一期收取
   * - 舉例:總金額 1733 元 分 6 期，除不盡的放第一期，293，288，288，288，288，288
   * - 信用卡分期不接受 Visa 金融卡、萬事達卡 Debit 金融卡及 JCB Debit 卡
   */
  CreditInstallment?: string;
  /**
   * 定期定額每次授權(扣款)金額
   * - 有定期收款需求時，且收款金額相同，可使用此收款方式
   * - 消費者只需刷一次卡，之後 oPay 會依設定，定期做信用卡授權
   * - 付款頁面會顯示每次刷卡的金額、週期及次數，可設定 於「每幾天」或「每幾月」或「每幾年」，扣幾次款(授權幾次)
   * - oPay 會依此次授權金額 [PeriodAmount] 所設定的金額做為之後固定授權的金額
   * - 交易金額 [TotalAmount] 設定金額必須和授權金額 [PeriodAmount] 相同
   * - 請帶整數，不可有小數點，僅限新台幣
   */
  PeriodAmount?: number;
  /**
   * 定期定額週期種類
   * - D: 以天為週期
   * - M: 以月為週期
   * - Y: 以年為週期
   */
  PeriodType?: "D" | "M" | "Y";
  /**
   * 定期定額執行頻率
   * - 至少要大於等於 1 次以上
   * - 當 PeriodType 設為 D 時，最多可設 365 次
   * - 當 PeriodType 設為 M 時，最多可設 12 次
   * - 當 PeriodType 設為 Y 時，最多可設 1 次
   */
  Frequency?: number;
  /**
   * 定期定額總共執行次數
   * - 至少要大於 1 次以上
   * - 當 PeriodType 設為 D 時，最多可設 999 次
   * - 當 PeriodType 設為 M 時，最多可設 99 次
   * - 當 PeriodType 設為 Y 時，最多可設 9 次
   *
   *
   * 1. 當信用卡定期定額扣款為每個月扣 1 次 500 元，總共要扣 12 次：
   *  - TotalAmount = 500
   *  - PeriodAmount = 500
   *  - PeriodType = M
   *  - requency = 1
   *  - ExecTimes = 12
   * 2. 當信用卡定期定額扣款為 6000 元，每 6 個月扣 1 次，總共要扣 2 次：
   *  - TotalAmount = 6000
   *  - PeriodType = M
   *  - Frequency = 6
   *  - ExecTimes = 2
   */
  ExecTimes?: number;
  /**
   * 定期定額的執行結果回應 URL
   * - 若交易是信用卡定期定額的方式，則每次執行授權完，會將授權結果回傳到這個設定的 URL
   * - 僅接受 http 80 port 與 https 443 port
   * - 最大字數 200
   */
  PeriodReturnURL?: string;
}

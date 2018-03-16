export type TVerifyMethod = (value: any) => boolean;
// export type TVerifyMethod = ((value: any) => boolean) | string;
export type TMultipleVerifyMethod = {
  [key: string]: TVerifyMethod | TVerifyMethod[];
};
export interface IVerifyErrorInfo {
  key?: string;
  info: string;
}
export class Verification {
  public errorInfo: IVerifyErrorInfo;
  private _valid = true;
  public constructor() {}
  public get errorMessage() {
    if (!this.errorInfo) return `errorInfo is empty.`;
    let msg = this.errorInfo.info;
    if (this.errorInfo.key) msg = `Invalid key: ${this.errorInfo.key}, ${msg}`;
    return msg;
  }
  public get valid() {
    return this._valid;
  }
  public get invalid() {
    return !this._valid;
  }
  private _verify(
    param: any,
    method: TVerifyMethod | TVerifyMethod[] | TMultipleVerifyMethod,
    keyName?: string
  ): boolean {
    if (typeof method == "function") {
      try {
        return method(param);
      } catch (err) {
        this.errorInfo = {
          key: keyName,
          info: err
        };
      }
      return false;
    } else if (method instanceof Array) {
      return (param || method.map(func => func.name).includes('required')) ?
      method.every(func => {
        return this._verify(param, func, keyName);
      }) : true;
    } else if (typeof method == "object") {
      let keys = Object.keys(method);
      return keys.every(key => {
        return this._verify(param[key], method[key], key);
      });
    }
    throw `Error Verification.verify: method is invalid. method: ${typeof method} = ${method}, param: ${typeof param} = ${param}`;
  }
  public verify(
    param: any,
    method: TVerifyMethod | TVerifyMethod[] | TMultipleVerifyMethod
  ): boolean {
    this.errorInfo = null;
    this._valid = this._verify(param, method);
    return this._valid;
  }
  public static required(value: any): boolean {
    let res = value;
    res = (res instanceof Object && Object.keys(res).length > 0) || (res instanceof Array && res.length > 0) || res
    if (!res) throw "value must be required.";
    return res;
  }
  public static isNull(value: any): boolean {
    let res = value === null;
    if (!res) throw "value must be null.";
    return res;
  }
  public static notNull(value: any): boolean {
    let res = value !== null;
    if (!res) throw "value must not be null.";
    return res;
  }
  public static isUndefined(value: any): boolean {
    let res = value === undefined;
    if (!res) throw "value must be undefined.";
    return res;
  }
  public static notUndefined(value: any): boolean {
    let res = value !== undefined;
    if (!res) throw "value must not be undefined.";
    return res;
  }
  public static isNumber(value: any): boolean {
    let res = typeof value == "number";
    if (!res) throw "value must be number.";
    return res;
  }
  public static isNumberOrEnglishLetter(value: any): boolean {
    let res = /^[a-zA-Z0-9]*$/.test(value);
    if (!res) throw "value must be number or english letter.";
    return res;
  }
  public static notNumber(value: any): boolean {
    let res = typeof value != "number";
    if (!res) throw "value must not be number.";
    return res;
  }
  public static isString(value: any): boolean {
    let res = typeof value == "string";
    if (!res) throw "value must be string.";
    return res;
  }
  public static notString(value: any): boolean {
    let res = typeof value != "string";
    if (!res) throw "value must not be string.";
    return res;
  }
  public static isBoolean(value: any): boolean {
    let res = typeof value == "boolean";
    if (!res) throw "value must be undefined.";
    return res;
  }
  public static notBoolean(value: any): boolean {
    let res = typeof value != "boolean";
    if (!res) throw "value must not be boolean.";
    return res;
  }
  public static isFunction(value: any): boolean {
    let res = typeof value == "function";
    if (!res) throw "value must be function.";
    return res;
  }
  public static notFunction(value: any): boolean {
    let res = typeof value != "function";
    if (!res) throw "value must not be function.";
    return res;
  }
  public static isObject(value: any): boolean {
    let res = typeof value == "object";
    if (!res) throw "value must be object.";
    return res;
  }
  public static notObject(value: any): boolean {
    let res = typeof value != "object";
    if (!res) throw "value must not be object.";
    return res;
  }
  public static isInteger(value: any): boolean {
    let res = value % 1 == 0;
    if (!res) throw "value must be integer.";
    return res;
  }
  public static minLength(min: number) {
    return (value: any): boolean => {
      let res = value.length >= min;
      if (!res) throw `length must greater than ${min}.`;
      return res;
    };
  }
  public static maxLength(max: number) {
    return (value: any): boolean => {
      let res = value.length <= max;
      if (!res) throw `length must smaller than ${max}.`;
      return res;
    };
  }
  public static lengthEqual(val: number) {
    return (value: any): boolean => {
      let res = value.length == val;
      if (!res) throw `length must equal: ${val}`;
      return res;
    };
  }
  public static lengthNotEqual(val: number) {
    return (value: any): boolean => {
      let res = value.length != val;
      if (!res) throw `length must not equal: ${val}`;
      return res;
    };
  }
  public static limitLength(min: number, max: number) {
    return (value: any): boolean => {
      let length = `${value}`.length;
      let res = min <= length && length <= max;
      if (!res) throw `length must in range: ${min} ~ ${max}.`;
      return res;
    };
  }
  public static isHttpUrl(value: any) {
    let res = /^http\:\/\//i.test(value);
    if (!res) throw `value must be http url.`;
    return res;
  }
  public static isHttpsUrl(value: any) {
    let res = /^https\:\/\//i.test(value);
    if (!res) throw `value must be https url.`;
    return res;
  }
  public static isUrl(value: any) {
    let res = /^(http|https)\:\/\//i.test(value);
    if (!res) throw `value must be url.`;
    return res;
  }
  public static minValue(min: number) {
    return (value: any): boolean => {
      let res = value >= min;
      if (!res) throw `value must greater than ${min}.`;
      return res;
    };
  }
  public static maxValue(max: number) {
    return (value: any): boolean => {
      let res = value <= max;
      if (!res) throw `length must smaller than ${max}.`;
      return res;
    };
  }
  public static limitValue(min: number, max: number) {
    return (value: any): boolean => {
      let res = min <= value && value <= max;
      if (!res) throw `value must in range: ${min} ~ ${max}.`;
      return res;
    };
  }
  public static isMatch(regexp: RegExp) {
    return (value: any): boolean => {
      let res = regexp.test(value);
      if (!res) throw `value must match RegExp: ${regexp}.`;
      return res;
    };
  }
  public static exactlyEqual(val: any) {
    return (value: any): boolean => {
      let res = value === val;
      if (!res) throw `value must exactly equal: ${val}.`;
      return res;
    };
  }
  public static equal(val: any) {
    return (value: any): boolean => {
      let res = value == val;
      if (!res) throw `value must equal: ${val}.`;
      return res;
    };
  }
  public static i(val: any) {
    return (value: any): boolean => {
      let res = value == val;
      if (!res) throw `value must equal: ${val}.`;
      return res;
    };
  }
  public static includes<T = any>(values: T[]) {
    return (value: any): boolean => {
      let res = values.indexOf(value) != -1;
      if (!res) throw `value must includes [${values.join(", ")}]`;
      return res;
    };
  }
  public static notIncludes<T = any>(values: T[]) {
    return (value: any): boolean => {
      let res = values.indexOf(value) != -1;
      if (!res) throw `value must not includes [${values.join(", ")}]`;
      return res;
    };
  }
  public static typeof(
    type: "string" | "function" | "number" | "object" | "boolean" | "undefined"
  ) {
    return (value: any): boolean => {
      let res = typeof value === type;
      if (!res) throw `value type must be: ${type}.`;
      return res;
    };
  }
  public static isOrder(order: any) {
    const V = Verification;
    const check = new V();
    check.verify(order, {
      EncryptType: [V.required, V.equal(1)],
      PaymentType: [V.required, V.equal("aio")],
      MerchantTradeDate: [V.required, V.isMatch(/^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/)],
      TotalAmount: [V.required, V.isNumber, V.minValue(1), V.isInteger],
      MerchantID: [V.required, V.isString, V.maxLength(10)],
      MerchantTradeNo: [
        V.required, 
        V.isString,
        V.maxLength(20),
        V.isNumberOrEnglishLetter
      ],
      TradeDesc: [V.required, V.isString, V.maxLength(200)],
      ItemName: [V.required, V.isString, V.maxLength(200)],
      ReturnURL: [V.required, V.isString, V.isUrl, V.maxLength(200)],
      ChoosePayment: [
        V.required,
        V.includes<string>([
          "Credit",
          "WebATM",
          "ATM",
          "CVS",
          "AccountLink",
          "TopUpUsed",
          "ALL"
        ])
      ]
    });
    if (!check.valid) throw check.errorMessage;
    return check.valid;
  }
  public static isPeriodOrder(order: any) {
    const V = Verification;
    const check = new V();
    check.verify(order, {
      StoreID: [V.isString, V.maxLength(20)],
      PeriodAmount: [V.required, V.isNumber],
      PeriodType: [V.required, V.isString],
      Frequency: [V.required, V.isNumber],
      ExecTimes: [V.required, V.isNumber],
      PeriodReturnURL: [V.isString]
    });
    if (!check.valid) throw check.errorMessage;
    return check.valid;
  }
}

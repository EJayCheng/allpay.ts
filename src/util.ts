import { IOPayConfig } from "config";
import * as crypto from "crypto";
import * as qs from "querystring";
export function generateMerchantTradeNo() {
  return `TN${Date.now()}R${randString(4)}`.slice(0, 20);
}
export function randString(
  length: number,
  option: {
    notAllowNumber?: boolean;
    notAllowEnglish?: boolean;
    notAllowLowercaseEnglish?: boolean;
    notAllowUppercaseEnglish?: boolean;
  } = {}
) {
  let possible = "";
  if (!option.notAllowNumber) possible += "0123456789";
  if (!option.notAllowEnglish && !option.notAllowUppercaseEnglish)
    possible += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (!option.notAllowEnglish && !option.notAllowLowercaseEnglish)
    possible += "abcdefghijklmnopqrstuvwxyz";
  let text = "";
  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
export function getMacValue(params: any, config: IOPayConfig) {
  if (typeof params != "object") throw "Error getMacValue: params is invalid.";
  let invalidKeys = ["CheckMacValue", "HashKey", "HashIV"];
  invalidKeys.forEach(key => {
    if (Object.keys(params).includes(key)) {
      throw new Error(`Error getMacValue: params shouldn't contain ${key}`);
    }
  });
  let raw = Object.keys(params)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map(key => `${key}=${params[key]}`)
    .join("&");
  raw = urlEncodeDotNet(
    `HashKey=${config.AIOHashKey}&${raw}&HashIV=${config.AIOHashIV}`
  );

  let res = "";
  switch (params.EncryptType) {
    case 0:
      res = crypto
        .createHash("md5")
        .update(raw)
        .digest("hex");
      break;
    default:
    case 1:
      res = crypto
        .createHash("sha256")
        .update(raw)
        .digest("hex");
      break;
  }
  return res.toUpperCase();
}

export function urlEncodeDotNet(str: string) {
  if (typeof str != "string") throw `Error urlEncodeDotNet: str is invalid.`;
  return encodeURIComponent(str)
    .toLowerCase()
    .replace(/\'/g, "%27")
    .replace(/\~/g, "%7e")
    .replace(/\%20/g, "+");
}

export function getPostFormHTML(url: string, params: any) {
  let inputs = Object.keys(params)
    .map(
      key =>
        `  <input type="hidden" name="${key}" id="opay_input_${key}" value="${
          params[key]
        }" />`
    )
    .join("\n");
  let id = `opay_form_${params.MerchantTradeNo}`;
  return `
<form id="${id}" action="${url}" method="post">
${inputs}
  <script type="text/javascript">document.getElementById("${id}").submit();</script>
</form>`;
}

export function verifyMacValue(body: any, config: IOPayConfig) {
  if (typeof body != "object") throw "Error verifyMacValue: body is invalid.";
  let mac: string = body.CheckMacValue;
  if (!mac) throw "Error verifyMacValue: CheckMacValue is empty.";
  delete body.CheckMacValue;
  let val = "";
  if (mac.length === 64) {
    val = getMacValue(body, config);
  } else if (mac.length === 32) {
    val = getMacValue(body, config);
  }
  return mac === val;
}

export function encryptAES(params: any, config: IOPayConfig) {
  if (typeof params != "object")
    throw new Error(`Error encryptAES: params is invalid.`);
  let sec = ["HashKey", "HashIV"];
  sec.forEach(key => {
    delete params[key];
  });
  let encipher = crypto.createCipheriv(
    "aes-128-cbc",
    config.AIOHashKey,
    config.AIOHashIV
  );
  let text = params["PaymentToken"];
  let encrypted_base64 = Buffer.concat([
    encipher.update(text),
    encipher.final()
  ]).toString("base64");
  return urlEncodeDotNet(encrypted_base64);
}

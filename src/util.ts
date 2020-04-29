import { createCipheriv, createHash } from "crypto";
import { IOPayConfig } from "./config";

export function getMacValue(params: any, config: IOPayConfig) {
  if (typeof params != "object") throw "Error getMacValue: params is invalid.";
  let invalidKeys = ["CheckMacValue", "HashKey", "HashIV"];
  invalidKeys.forEach((key) => {
    if (Object.keys(params).includes(key)) {
      throw new Error(`Error getMacValue: params shouldn't contain ${key}`);
    }
  });
  let raw = Object.keys(params)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  raw = urlEncodeDotNet(
    `HashKey=${config.AIOHashKey}&${raw}&HashIV=${config.AIOHashIV}`
  );

  let res = "";
  switch (params.EncryptType) {
    case 0:
      res = createHash("md5").update(raw).digest("hex");
      break;
    default:
    case 1:
      res = createHash("sha256").update(raw).digest("hex");
      break;
  }
  return res.toUpperCase();
}

export function urlEncodeDotNet(str: string): string {
  if (typeof str != "string") throw `Error urlEncodeDotNet: str is invalid.`;
  return encodeURIComponent(str)
    .toLowerCase()
    .replace(/\'/g, "%27")
    .replace(/\~/g, "%7e")
    .replace(/\%20/g, "+");
}

export function toPostFormHtml(url: string, params: any) {
  let inputs = Object.keys(params)
    .map(
      (key) =>
        `  <input type="hidden" name="${key}" id="opay-input-${key}" value="${params[key]}" />`
    )
    .join("\n");
  let id = `opay-form-${params.MerchantTradeNo}`;
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
  return [64, 32].includes(mac.length) && getMacValue(body, config) === mac;
}

export function encryptAES(params: any, config: IOPayConfig) {
  if (typeof params != "object")
    throw new Error(`Error encryptAES: params is invalid.`);
  let sec = ["HashKey", "HashIV"];
  sec.forEach((key) => {
    delete params[key];
  });
  let encipher = createCipheriv(
    "aes-128-cbc",
    config.AIOHashKey,
    config.AIOHashIV
  );
  let text = params["PaymentToken"];
  let encrypted_base64 = Buffer.concat([
    encipher.update(text),
    encipher.final(),
  ]).toString("base64");
  return urlEncodeDotNet(encrypted_base64);
}

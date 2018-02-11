import { IOPayConfig } from "config";
import * as crypto from "crypto";

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
    `HashKey=${config.AIOHashKey}${raw}HashIV=${config.AIOHashIV}`
  );

  let res = "";
  switch (params.EncryptType) {
    case 0:
      res = crypto
        .createHash("md5")
        .update(raw)
        .digest("hex");
      break;
    case 1:
      res = crypto
        .createHash("sha256")
        .update(raw)
        .digest("hex");
      break;
    default:
      throw "Error getMacValue: Unexpected hash mode.";
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
        `<input type="hidden" name="${key}" id="opay_input_${key}" value="${
          params[key]
        }" />`
    )
    .join("\n");
  let id = `opay_form_${params.MerchantTradeNo}`;
  return `
  <form id="${id}" action="${url}" method="post">";
    ${inputs}
    <script type="text/javascript">document.getElementById("${id}").submit();</script>
  </form>`;
}

export function verifyMacValue(body: string, config: IOPayConfig) {
  if (typeof body != "string") throw "Error verifyMacValue: body is invalid.";
  let params: any = {};
  body
    .split("&")
    .map(str => str.split("="))
    .forEach(param => {
      params[param[0]] = param[1];
    });
  let mac: string = params.CheckMacValue;
  delete params.CheckMacValue;
  let val = "";
  if (mac.length === 64) {
    val = getMacValue(params, config);
  } else if (mac.length === 32) {
    val = getMacValue(params, config);
  }
  return mac === val;
}

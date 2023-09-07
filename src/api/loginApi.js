import { URL } from "../config";
// import * as CryptoJS from "crypto-js";

export async function logInApi(data) {
  data.type = +data.type;
  try {
    const response = await fetch(URL + "user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // credentials: "include",
      body: JSON.stringify({ data: [data] }),
    });
    const responseJson = await response.json();
    if (response.ok) {
      return responseJson;
    } else {
      throw new Error(responseJson.message);
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

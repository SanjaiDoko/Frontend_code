import { toast } from "react-toastify";
import { URL } from "../config";
// import * as CryptoJS from "crypto-js";

export const saveregistration = async (data) => {
  // payload encryption
  // const encryptedPayload = CryptoJS.AES.encrypt(
  // 	JSON.stringify({ data: [data] }),
  // 	import.meta.env.VITE_ENCRYPTION_KEY
  // ).toString();
  try {
    const response = await fetch(URL + "user/register", {
      method: "POST",
      body: JSON.stringify({ data: [data] }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseJson = await response.json();
    if (responseJson.status === 0) {
      toast.error(responseJson.message);
      throw new Error(responseJson.response);
    }
    return responseJson;
  } catch (error) {
    toast.error(error.message);
    throw new Error(error.message);
  }
};

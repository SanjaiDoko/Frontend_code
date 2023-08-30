import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { fetchData } from "../helper";
import { URL } from "../config";

const useResetpasswordData = () => {
  return useMutation({
    mutationFn: (data) => {
      let payload = data;
      payload.type = parseInt(data.type);
      return fetchData(
        {
          url: URL + "user/forgotpassword",
          method: "POST",
          isAuthRequired: true,
          isEncryptedPayload: false,
        },
        { data: [payload] }
      );
    },
    onSuccess: () => {
      toast.success("Check your Inbox");
    },
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

export { useResetpasswordData };

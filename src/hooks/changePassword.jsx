import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { fetchData } from "../helper";
import { useNavigate } from "react-router-dom";
import { URL } from "../config";

const useChangepasswordData = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data) => {
      // const encryptedPassword = CryptoJS.AES.encrypt(
      // 	JSON.stringify(data.password),
      // 	import.meta.env.VITE_ENCRYPTION_KEY
      // ).toString();
      return fetchData(
        {
            url: URL +'user/changeForgotPassword',
          method: "POST",
          // isAuthRequired: true,
          isEncryptedPayload:false,
        },
        { data: [data] }
      );
    },
    onSuccess: () => {
      toast.success("Password Changed Successfully");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

export { useChangepasswordData };

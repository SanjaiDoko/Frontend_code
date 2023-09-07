import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { saveregistration } from "../api/registrationApi";
import { useNavigate } from "react-router-dom";

const usePostRegistrationData = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: saveregistration,
    onSuccess: (data) => {
      if (data.status === 0) {
        toast.error(data.response);
      } else {
        navigate("/login");
        toast.success('Registered Successfully')
      }
    },
    onError: (error) => {
        // console.log(error,"asdasdasdasd")
      toast.error(error.message.split(":"));
    },
  });
};

export { usePostRegistrationData };

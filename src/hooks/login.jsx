import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { logInApi } from "../api/loginApi";
import jwtDecode from "jwt-decode";
import { setProfileData } from "../redux/slices/profileSlice";
import { useDispatch } from "react-redux";

const useLoginData = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (data) => logInApi(data),
    onSuccess: async (data) => {
      if (data.status === 1) {
        const parsedData = JSON.parse(data.data);
        // console.log(parsedData , 'rprprp')
        const decodedData = jwtDecode(parsedData.token);
        localStorage.setItem("allMasterToken", parsedData.token);
        localStorage.setItem("allMasterId", parsedData.userId);
        localStorage.setItem("groupId", parsedData.groupId);
        data.role = decodedData.role;
        dispatch(setProfileData(decodedData));
        // await queryClient.refetchQueries({ queryKey: ["profileData"] });
        // checkStatus(decodedData.status, decodedData.role);
      } else {
        if (data.status === 0 && data.data != null) {
          localStorage.setItem("allMasterId", data.data);
          // setLoggedInCheck({
          //     userId: data.data,
          //     modal: true,
          // });
        } else {
          toast.error(data.response);
        }
      }
    },
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

export { useLoginData };

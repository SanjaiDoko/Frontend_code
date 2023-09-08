import { useMutation } from "@tanstack/react-query";
import { fetchData } from "../helper";
import { URL } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
// import { useSelector } from "react-redux";

const useLogoutUser = (redirect = true, userType) => {
  const id = localStorage.getItem("allMasterId");
  const type =
    redirect === false
      ? parseInt(userType)
      : useSelector((state) => state.profile.type);

  return useMutation({
    mutationFn: () =>
      fetchData(
        {
          url: URL + "user/logout",
          method: "POST",
          //   isAuthRequired: true,
        },
        { data: [{ id, type }] }
      ),
    onSuccess: () => {
      if (redirect) {
        window.location.replace("/login");
        localStorage.clear();
      }
    },
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

export { useLogoutUser };

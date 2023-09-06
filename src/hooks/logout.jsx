import { useMutation } from "@tanstack/react-query";
import { fetchData } from "../helper";
import { URL } from "../config";
// import { useSelector } from "react-redux";

const useLogoutUser = (type) => {
  const id = localStorage.getItem("allMasterId");

  return useMutation({
    mutationFn: () =>
      fetchData(
        {
          url: URL + "user/logout",
          method: "POST",
          //   isAuthRequired: true,
        },
        { data: [{ id, type: +type }] }
      ),
    onSuccess: () => {
      window.location.replace("/login");
      localStorage.clear();
    },
  });
};

export { useLogoutUser };

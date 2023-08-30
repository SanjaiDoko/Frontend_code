import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { fetchData } from "../helper";
import { URL } from "../config";

const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: () =>
      fetchData({
        url: URL + "user/getAllUsers",
        isAuthRequired: true,
      }),
    refetchOnMount: true,
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

export { useGetAllUsers };

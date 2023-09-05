import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

const useMutateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        {
          url: URL + "user/updateStatus",
          method: "POST",
          isAuthRequired: true,
        },
        { data: [data] }
      ),
    onSuccess: async () => {
      toast.success("Status Updated Successfully");
      queryClient.invalidateQueries({
        queryKey: ["allUsers"],
      });
    },
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

const useGetUserDetailsById = (id) =>
  useQuery({
    queryKey: ["userId", id],
    queryFn: () => {
      return fetchData(
        {
          url: URL + "user/getUserDetails",
          method: "POST",
          isAuthRequired: true,
        },
        {
          data: [
            {
              id,
            },
          ],
        }
      );
    },
  });

export { useGetAllUsers, useMutateUser, useGetUserDetailsById };

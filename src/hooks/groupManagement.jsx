import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { fetchData } from "../helper";
import { URL } from "../config";

const useGetAllGroups = () => {
  return useQuery({
    queryKey: ["allGroups"],
    queryFn: () =>
      fetchData({
        url: URL + "group/getAllGroups",
        // isAuthRequired: true,
      }),
    refetchOnMount: true,
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

const useInsertGroup = (onSuccessFunctions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        {
          url: URL + "group/insertGroup",
          method: "POST",
          // isAuthRequired: true,
        },
        { data: [data] }
      ),
    onSuccess: async () => {
      onSuccessFunctions();
      toast.success("Group Added Successfully");
      queryClient.invalidateQueries({
        queryKey: ["allGroups"],
      });
    },
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};
const useUpdateGroup = (onSuccessFunctions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        {
          url: URL + "group/UpdateGroup",
          method: "POST",
          // isAuthRequired: true,
        },
        { data: [data] }
      ),
    onSuccess: async () => {
      onSuccessFunctions();
      toast.success("Group Updated Successfully");
      queryClient.invalidateQueries({
        queryKey: ["allGroups"],
      });
    },
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};
const useRemoveUserById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => {
      console.log(data, "data");

      fetchData(
        {
          url: URL + "group/removeUserById",
          method: "POST",
          // isAuthRequired: true,
        },
        { data: [{ id: data }] }
      );
    },
    onSuccess: async () => {
      toast.success("User removed Successfully");
      queryClient.invalidateQueries({
        queryKey: ["allGroups"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getUserByGroupId"],
      });
    },
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};
const useGetUserByGroupId = (id) =>
  useQuery({
    queryKey: ["getUserByGroupId"],
    queryFn: () => {
      return fetchData(
        {
          url: URL + "user/getUserByGroupId",
          method: "POST",
          // isAuthRequired: true,
        },
        {
          data: [
            {
              id: id,
            },
          ],
        }
      );
    },
    enabled: id != null,
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });

export {
  useGetAllGroups,
  useInsertGroup,
  useUpdateGroup,
  useRemoveUserById,
  useGetUserByGroupId,
};

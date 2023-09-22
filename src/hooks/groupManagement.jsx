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
        isAuthRequired: true,
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
          isAuthRequired: true,
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
          isAuthRequired: true,
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
      fetchData(
        {
          url: URL + "group/removeUserById",
          method: "POST",
          isAuthRequired: true,
        },
        { data: [{ id: data }] }
      );
    },
    onSuccess: async () => {
      toast.success("User removed Successfully");
      await queryClient.invalidateQueries({
        queryKey: ["allGroups"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["allUsers"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["getUserByGroupId"],
      });
    },
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};
const useGetUserByGroupId = () =>
  useMutation({
    mutationFn: (id) => {
      return fetchData(
        {
          url: URL + "user/getUserByGroupId",
          method: "POST",
          isAuthRequired: true,
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

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

const useInsertGroup = () => {
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
const useUpdateGroup = () => {
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

export { useGetAllGroups, useInsertGroup, useUpdateGroup };

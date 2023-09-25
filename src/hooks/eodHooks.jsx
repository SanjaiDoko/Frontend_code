import { toast } from "react-toastify";
import { fetchData } from "../helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { URL } from "../config";
import { useNavigate } from "react-router-dom";

const useMutateEod = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        {
          url: URL + "eod/insertEod",
          method: "POST",
          isAuthRequired: true,
        },
        { data: [data] }
      ),
    onSuccess: async () => {
      toast.success("EOD Added Successfully");
      navigate("/eod/eodlist");
      queryClient.invalidateQueries({
        queryKey: ["allEods"],
      });
    },
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

const useGetEodById = (id) =>
  useQuery({
    queryKey: ["allEods", id],
    queryFn: () => {
      return fetchData(
        {
          url: URL + "eod/getEodsByUserId",
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
const useGetEodDetailsById = (id) =>
  useQuery({
    queryKey: ["allEods", id],
    queryFn: () => {
      return fetchData(
        {
          url: URL + "eod/getEodDetailsById",
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

const useGetEodsByMangerId = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        {
          url: URL + "eod/getEodsByMangerId",
          method: "POST",
          isAuthRequired: true,
        },
        { data: [data] }
      ),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["allEods"],
      });
    },
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

export {
  useMutateEod,
  useGetEodById,
  useGetEodsByMangerId,
  useGetEodDetailsById,
};

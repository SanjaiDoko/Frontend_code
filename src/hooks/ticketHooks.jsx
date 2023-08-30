import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "../helper";
import { URL } from "../config";

const useGetAllTicketById = (id) =>
  useQuery({
    queryKey: ["allTickets", id],
    queryFn: () => {
      return fetchData(
        {
          url: URL + "ticket/getTicketsByUserId",
          method: "POST",
          isAuthRequired: false,
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

const useInsertTicket = (onSuccessFunctions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        {
          url: URL + "ticket/insertTicket",
          method: "POST",
          isAuthRequired: false,
        },
        { data: [data] }
      ),
    onSuccess: (data) => {
      onSuccessFunctions(data);
      queryClient.invalidateQueries({ queryKey: ["allTickets"] });
    },
  });
};
const useUpdateTicket = (onSuccessFunctions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        {
          url: URL + "ticket/updateTicket",
          method: "POST",
          isAuthRequired: false,
        },
        { data: [data] }
      ),
    onSuccess: (data) => {
      onSuccessFunctions(data);
      queryClient.invalidateQueries({ queryKey: ["allTickets"] });
    },
  });
};

export { useGetAllTicketById, useInsertTicket, useUpdateTicket };

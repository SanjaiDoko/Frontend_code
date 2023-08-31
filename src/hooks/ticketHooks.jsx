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
const useGetAllUserByGroupId = (id) =>
  useQuery({
    queryKey: ["allTickets", id],
    queryFn: () => {
      return fetchData(
        {
          url: URL + "user/getUserByGroupId",
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

const useGetManageTicketById = (id) =>
  useQuery({
    queryKey: ["allTickets", id],
    queryFn: () => {
      return fetchData(
        {
          url: URL + "ticket/getAllRecievedTicketsByManagerId",
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

const useGetAllReceivedTicketById = (id, role) =>
  useQuery({
    queryKey: ["allTickets", id, role],
    queryFn: () => {
      return fetchData(
        {
          url: URL + "ticket/getAllRecievedTicketsByUserId",
          method: "POST",
          isAuthRequired: false,
        },
        {
          data: [
            {
              id,
              role,
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

export {
  useGetAllTicketById,
  useInsertTicket,
  useUpdateTicket,
  useGetAllReceivedTicketById,
  useGetManageTicketById,
  useGetAllUserByGroupId,
};

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

const useGetSpecificTicketById = (id) =>
  useQuery({
    queryKey: ["specifiTickets", id],
    queryFn: () => {
      return fetchData(
        {
          url: URL + "ticket/getTicketById",
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
    queryKey: ["allGroupTickets", id],
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
    queryKey: ["ManageTickets", id],
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
    queryKey: ["ReceivedTickets", id, role],
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
      queryClient.invalidateQueries({ queryKey: ["ReceivedTickets"] });
      queryClient.invalidateQueries({ queryKey: ["ManageTickets"] });
      queryClient.invalidateQueries({ queryKey: ["specifiTickets"] });
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
  useGetSpecificTicketById,
};

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

const useGetSpecificTicketById = (id) =>
  useQuery({
    queryKey: ["specifiTickets", id],
    queryFn: () => {
      return fetchData(
        {
          url: URL + "ticket/getTicketById",
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

const useGetAllUserByGroupId = (id) =>
  useQuery({
    queryKey: ["allGroupTickets", id],
    queryFn: () => {
      return fetchData(
        {
          url: URL + "user/getUserByGroupId",
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

const useGetManageTicketById = (id, role) =>
  useQuery({
    queryKey: ["ManageTickets", id],
    queryFn: () => {
      return fetchData(
        {
          url: URL + "ticket/getAllRecievedTicketsByManagerId",
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
    enabled: role === 3,
  });

const useGetAllReceivedTicketById = (id, role) =>
  useQuery({
    queryKey: ["ReceivedTickets", id, role],
    queryFn: () => {
      return fetchData(
        {
          url: URL + "ticket/getAllRecievedTicketsByUserId",
          method: "POST",
          isAuthRequired: true,
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
          isAuthRequired: true,
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
          isAuthRequired: true,
        },
        { data: [data] }
      ),
    onSuccess: async (data) => {
      onSuccessFunctions(data);
      await queryClient.invalidateQueries({ queryKey: ["allTickets"] });
      await queryClient.invalidateQueries({ queryKey: ["ReceivedTickets"] });
      await queryClient.invalidateQueries({ queryKey: ["ManageTickets"] });
      await queryClient.invalidateQueries({ queryKey: ["specifiTickets"] });
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

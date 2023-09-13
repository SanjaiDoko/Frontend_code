import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { fetchData } from "../helper";
import { URL } from "../config";

const useGetAllRooms = () => {
  return useQuery({
    queryKey: ["allRooms"],
    queryFn: () =>
      fetchData({
        url: URL + "room/getAllRooms",
        isAuthRequired: false,
      }),
    refetchOnMount: true,
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

const useInsertRoom = (onSuccessFunctions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        {
          url: URL + "room/createRoom",
          method: "POST",
          isAuthRequired: false,
        },
        { data: [data] }
      ),
    onSuccess: async () => {
      onSuccessFunctions();
      toast.success("Room Added Successfully");
      queryClient.invalidateQueries({
        queryKey: ["allGroups"],
      });
    },
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

const useUpdateRoom = (onSuccessFunctions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        {
          url: URL + "room/updateRoom",
          method: "POST",
          isAuthRequired: false,
        },
        { data: [data] }
      ),
    onSuccess: async () => {
      onSuccessFunctions();
      toast.success("Room Updated Successfully");
      queryClient.invalidateQueries({
        queryKey: ["allRooms"],
      });
    },
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

const useInsertRoomBooking = (onSuccessFunctions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        {
          url: URL + "room/bookRoom",
          method: "POST",
          isAuthRequired: false,
        },
        { data: [data] }
      ),
    onSuccess: async () => {
      onSuccessFunctions();
      toast.success("Room Booked Successfully");
      queryClient.invalidateQueries({
        queryKey: ["getBookingRoomsByUserId"],
      });
    },
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

const useGetRoomBookingsByUserId = (id) => {
  return useQuery({
    queryKey: ["getBookingRoomsByUserId",id],
    queryFn: () =>
      fetchData(
        {
          url: URL + "room/getMyBookings",
          isAuthRequired: false,
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
      ),
    refetchOnMount: true,
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

const useGetRoomBookingsDetails = () => {
  return useQuery({
    queryKey: ["getBookingRoomsByUserId"],
    queryFn: () =>
      fetchData(
        {
          url: URL + "room/getMyBookings",
          isAuthRequired: false,
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
      ),
    refetchOnMount: true,
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

export {
  useGetAllRooms,
  useInsertRoom,
  useUpdateRoom,
  useInsertRoomBooking,
  useGetRoomBookingsByUserId,
  useGetRoomBookingsDetails,
};

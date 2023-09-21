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
        queryKey: ["allRooms"],
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
      await queryClient.invalidateQueries({
        queryKey: ["getBookingRoomsByUserId"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["getRoomBookingDetails"],
      });
    },
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });
};

const useGetRoomBookingsByUserId = (id) => {
  return useQuery({
    queryKey: ["getBookingRoomsByUserId", id],
    queryFn: () =>
      fetchData(
        {
          url: URL + "room/getMyBookings",
          method: "POST",
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

const useGetRoomBookingsDetails = (id) => {
  return useQuery({
    queryKey: ["getRoomBookingDetails", id],
    queryFn: () =>
      fetchData(
        {
          url: URL + "room/getRoomById",
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

const useCancelRoomBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) =>
      fetchData(
        {
          url: URL + "room/cancelMeeting",
          method: "POST",
          isAuthRequired: false,
        },
        { data: [data] }
      ),
    onSuccess: async () => {
      // onSuccessFunctions();
      toast.success("Room Booking canceled Successfully");
      queryClient.invalidateQueries({
        queryKey: ["getBookingRoomsByUserId"],
      });
    },
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
  useCancelRoomBooking,
};

import * as yup from "yup";
import moment from "moment";

export const createRoomValidation = yup.object({
  roomNo: yup.string().trim().required("Room Number is required"),
  roomName: yup.string().trim().required("Room Name is required"),
});

export const bookRoomValidation = yup.object({
  bookingFor: yup.string().trim().required("Reason is required"),
  description: yup.string().trim().required("Boooking Descripiton is required"),
  startDate: yup
    .string()
    .required("Start Date is required")
    // .validateDate("Invalid date")
    .transform((value) =>
      value !== null ? moment(value).format("YYYY-MM-DDTHH:mm:ss.sssZ") : value
    ),
  endDate: yup
    .string()
    .required("End Date is required")
    // .validateDate("Invalid date")
    .transform((value) =>
      value !== null ? moment(value).format("YYYY-MM-DDTHH:mm:ss.sssZ") : value
    ),
    headCount: yup.number().required("Meeting strength is required")
});

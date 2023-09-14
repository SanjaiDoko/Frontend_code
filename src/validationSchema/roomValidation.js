import * as yup from "yup";
import moment from "moment";

export const createRoomValidation = yup.object({
  roomNo: yup.string().trim().required("Room Number is required"),
  roomName: yup.string().trim().required("Room Name is required"),
});


export const bookRoomValidation = yup.object({
  bookedReason: yup.string().trim().required("Reason is required"),
  headCount: yup
  .number().min(0, "Invalid Count number").typeError("Invalid Count number").required().nullable(),
  startsAt: yup
    .string()
    .required("Start Date is required")
    .transform((value) =>
      value !== null ? moment(value).format("YYYY-MM-DDTHH:mm:ss.sssZ") : value
    ),
    endsAt: yup
    .string()
    .required("End Date is required")
    .transform((value) =>
      value !== null ? moment(value).format("YYYY-MM-DDTHH:mm:ss.sssZ") : value
    )
    .test('custom-validation', 'End Time should be greater than Start Time', function (value) {
      const field1Value = moment(this.parent.startsAt);
      const endTime = moment(value)

      return endTime.isAfter(field1Value)
    })
});

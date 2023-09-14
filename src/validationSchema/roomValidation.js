import * as yup from "yup";
import moment from "moment";

export const createRoomValidation = yup.object({
  roomNo: yup.string().trim().required("Room Number is required"),
  roomName: yup.string().trim().required("Room Name is required"),
});


export const bookRoomValidation = yup.object({
  bookedReason: yup.string().trim().required("Reason is required"),
  headCount: yup
  .number()
  .typeError('Count is required')
  .min(0, 'Negative numbers are not allowed')
  .nullable()
  .required('Count is required'),
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
    }),
    headCount: yup.number().required("Meeting strength is required")
});

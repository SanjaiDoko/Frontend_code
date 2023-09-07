import * as yup from "yup";

export const updateReceivedTicketValidation = yup.object({
  issueName: yup.string().trim().required("Issue Name is required"),
  type: yup.string().trim().required("type is required"),
  issueDescription: yup.string().trim().required("Description is required"),
  issueGroup: yup.string().trim().required("Issue Group is required"),
  actualEndTime: yup.string().trim().required("Actual End Time is required"),
  timeLog: yup.string().trim().required("Time Log is required"),
});

import * as yup from "yup";

export const addTicketValidation = yup.object({
  issueName: yup.string().trim().required("Issue Name is required"),
  type: yup.string().trim().required("Type is required"),
  issueDescription: yup.string().trim().required("Description is required"),
  issueGroup: yup.string().trim().required("Issue Group is required"),
  mailList: yup.array(),
  // managerName: yup.string().trim().required("Managed By is required"),
  // assignedTo: yup.string().trim().required("Assigned To is required"),
  // startTime: yup.string().trim().required("Start Time is required"),
  // endTime: yup.string().trim().required("End Time is required"),
  // actualEndTime: yup.string().trim().required("Actual End Time is required"),
});

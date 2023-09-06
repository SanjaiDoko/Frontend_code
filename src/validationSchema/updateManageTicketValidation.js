import * as yup from "yup";

export const updateManageTicketValidation = yup.object({
  issueName: yup.string().trim().required("Issue Name is required"),
  type: yup.string().trim().required("type is required"),
  issueDescription: yup.string().trim().required("Description is required"),
  issueGroup: yup.string().trim().required("Issue Group is required"),
  endTime: yup.string().trim().required("End Time is required"),
});

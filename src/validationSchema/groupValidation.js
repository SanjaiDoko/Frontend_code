import * as yup from "yup";

export const addGroupValidation = yup.object({
  grpName: yup.string().trim().required("Group Name is required"),
  managedBy: yup.string().trim().required("Manager is required"),
  // users: yup.array().nullable().typeError("Members are required"),
});
export const editGroupValidation = yup.object({
  grpName: yup.string().trim().required("Group Name is required"),
  // managedBy: yup.string().lowercase().trim(),
  // users: yup.array(),
});

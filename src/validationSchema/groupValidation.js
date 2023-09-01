import * as yup from "yup";

export const addGroupValidation = yup.object({
  grpName: yup
    .string()
    .lowercase()
    .trim()
    .required("Group Name is required"),
  managedBy: yup.string().lowercase().trim().required("Managed by is required"),
  users: yup.array().required("Users is required"),
});
export const editGroupValidation = yup.object({
  grpName: yup
    .string()
    .lowercase()
    .trim()
    .required("Group Name is required"),
  // managedBy: yup.string().lowercase().trim(),
  // users: yup.array(),
});

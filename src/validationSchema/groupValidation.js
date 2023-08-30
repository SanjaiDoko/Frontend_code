import * as yup from "yup";

export const groupValidation = yup.object({
  grpName: yup
    .string()
    .lowercase()
    .trim()
    .required("Group Name is required"),
  managedBy: yup.string().lowercase().trim().required("Managed by is required"),
  users: yup.array().required("Users is required"),
});

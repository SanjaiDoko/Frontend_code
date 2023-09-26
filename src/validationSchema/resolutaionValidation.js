import * as yup from "yup";

export const resolutionValidation = yup.object({
  problem: yup.string().trim().required("Problem is required"),
  resolution: yup.string().trim().required("Resolution is required"),
});

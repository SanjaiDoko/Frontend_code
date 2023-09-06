import * as yup from "yup";

export const resolutionValidation = yup.object({
  problem: yup.string().required("Problem is required"),
  resolution: yup.string().required("Resolution is required"),
});

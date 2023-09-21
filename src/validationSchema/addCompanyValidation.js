import * as yup from "yup";

export const addCompanyValidation = yup.object({
    companyName: yup.string().trim().required("Company Name is required"),
    contact: yup.string()
    .required("Mobile Number is required")
    .matches(/^[0-9]+$/, "Enter valid Mobile Number")
    .min(10, "Should have atleast 10 numbers")
    .max(10, "Maximum 10 numbers are allowed"),
});

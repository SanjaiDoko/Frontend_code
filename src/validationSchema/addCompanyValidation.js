import * as yup from "yup";

export const addCompanyValidation = yup.object({
    companyName: yup.string().trim().required("Company Name is required"),
    contact: yup.string().trim().required("Mobile Number is required"),
});

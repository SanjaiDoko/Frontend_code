import * as yup from "yup";

export const createSalesCallValidation = yup.object({
    companyId: yup.string().trim().required("Company Name is required"),
    assignedTo: yup.string().trim().required("Assign to required"),
});

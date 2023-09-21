import * as yup from "yup";

export const createSalesCallValidation = yup.object({
    companyId: yup.array().of(yup.string()).min(1, 'At least select one company name').required("Company Name is required"),
    assignedTo: yup.string().trim().required("Assign to required"),
});

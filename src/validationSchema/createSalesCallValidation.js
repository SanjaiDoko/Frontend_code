import * as yup from "yup";

export const createSalesCallValidation = yup.object({
    assignedTo: yup.string().trim().required("Assign to required"),
});

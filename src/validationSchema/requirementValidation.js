import * as yup from "yup"
export const Schema= yup
.object({
    subject:yup
    .string()
    .trim()
    .required('Subject is required'),
    description:yup
    .string()
    .trim()
    .required('Reqiurements is required')
})

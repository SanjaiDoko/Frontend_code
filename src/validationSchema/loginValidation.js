import * as yup from "yup";

export const loginValidation = yup.object({
	email: yup
		.string()
		.trim()
		.lowercase()
		.required("Email is required")
		.email("Enter valid email"),
	password: yup.string().trim().required("Password is required"),
	type: yup
		.number()
		.positive("Type is required")
		.required("Type is required"),
});

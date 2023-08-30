import * as yup from "yup";

export const resetPasswordValidation = yup.object({
	email: yup
		.string()
		.email("Enter valid email address")
		.matches(
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			"Enter valid email address"
		)
		.required("Email is required"),
	type: yup.string().required("Type is required"),
});

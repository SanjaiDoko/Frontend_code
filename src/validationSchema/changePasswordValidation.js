import * as yup from "yup";

export const changePasswordValidation = yup.object({
	password: yup
		.string()
		.trim()
		.required("Password is required")
		.matches(
			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.,_]).{8,}$/,
			"Invalid password format"
		),
	confirmPassword: yup
		.string()
		.trim()
		.required("Confirm password is required")
		.oneOf([yup.ref("password")], "Password does not match"),
	otp: yup.string().trim().required("Confirm OTP is required"),
});

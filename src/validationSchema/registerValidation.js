import * as yup from "yup";

export const registerValidation = yup.object({
  fullName: yup
    .string()
    .trim()
    .required("Full Name is required")
    .matches(/^[a-zA-Z ]*$/, "Only alphabets are allowed"),
  mobileNumber: yup
    .string()
    .required("Mobile Number is required")
    .matches(/^[0-9]+$/, "Enter valid Mobile Number")
    .min(10, "Should have atleast 10 numbers")
    .max(10, "Maximum 10 numbers are allowed"),
  email: yup
    .string()
    .email("Enter valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .trim()
    .required("Password is required")
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.,_]).{8,}$/,
      "Invalid Password format"
    ),
  confirmPassword: yup
    .string()
    .trim()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Password does not match"),
});

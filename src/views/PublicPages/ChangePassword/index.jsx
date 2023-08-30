import styles from "./index.module.css";
// import Logo from "../../../assets/Images/AllMasterslogo.jpg";
import { AiFillEye } from "react-icons/ai";
import { BsFillEyeSlashFill } from "react-icons/bs";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { changePasswordValidation } from "../../../validationSchema/changePasswordValidation";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useChangepasswordData } from "../../../hooks/changePassword";

// import { useMutation } from "@tanstack/react-query";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { CircularProgress } from "@mui/material";
// import Tooltip from "@mui/material/Tooltip";
// import InfoIcon from "@mui/icons-material/Info";

function ChangePassword() {

	// const randomString = Math.random().toString(36).substring(2, 8);
	// const [captcha, setCaptcha] = useState(randomString);
	// const [validUser, setValidUser] = useState(false);
	// const [captchaValue, setCaptchValue] = useState("");
	const [passwordVisibile, setPasswordVisibile] = useState(false);
	const {mutate} = useChangepasswordData();
	const { id } = useParams();
	const [confirmPasswordVisibile, setConfirmPasswordVisibile] =
		useState(false);
	const userType = window.location.href.slice(-1);
	const {
		handleSubmit,
		formState: { errors },
		control,
	} = useForm({
		resolver: yupResolver(changePasswordValidation),
		mode: "onTouched",
		defaultValues: {
			password: "",
			confirmPassword: "",
			type: userType,
			otp: "",
		},
	});
	

	const togglePasswordVisiblity = (type) => {
		switch (type) {
			case "password":
				setPasswordVisibile((boolean) => !boolean);
				break;
			case "confirmPassword":
				setConfirmPasswordVisibile((boolean) => !boolean);
				break;
			default:
				break;
		}
	};


	const onSubmit = (data) => {
		data.id = id
		mutate(data)
        console.log(data,'data');
		// if (import.meta.env.VITE_CAPTCHA === "true") {
		// 	if (!captchaValue) {
		// 		toast.error("Please Enter Captcha");
		// 	} else {
		// 		if (!validUser) {
		// 			toast.error("Invalid Captcha, please try again");
		// 		} else {
		// 			data.id = id;
		// 			changepasswordData.mutate(data);
		// 		}
		// 	}
			// if (
			// 	captchaToken === null ||
			// 	captchaToken === undefined ||
			// 	captchaToken === ""
			// ) {
			// 	toast.error("Please Enter Captcha");
			// } else {
			// 	data.id = id;
			// 	changepasswordData.mutate(data);
			// }
		// } else {
		// 	data.id = id;
		// 	changepasswordData.mutate(data);
		// }
	};

	// const refreshCaptchaHandler = () => {
	// 	let randomstring = Math.random().toString(36).substring(2, 8);
	// 	setCaptcha(randomstring);
	// 	setCaptchValue("");
	// 	setValidUser(false);
	// };

	// const capthaOnChangeHandler = (e) => {
	// 	setCaptchValue(e.target.value);
	// 	if (e.target.value === captcha) {
	// 		setValidUser(true);
	// 	} else {
	// 		setValidUser(false);
	// 	}
	// };

	const preventInputEvents = (e) => {
		e.preventDefault();
	};

	return (
		<div className={styles.maindiv}>
			<div className="container flexdiv">
				<Form
					id={`${styles.form} form`}
					onSubmit={handleSubmit(onSubmit)}>
					<div className={styles.Logodiv}>
						{/* <img
							src={Logo}
							alt="AllMasters Logo"
							className="masterlogo"
						/> */}
						<h5 className="pt-2">Change Password</h5>
						<p>& take back control now</p>
					</div>
					<Form.Group className={`${styles.passiconposition} pt-2`}>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
							}}>
							<Form.Label
								className={styles.changepasslabel}
								htmlFor="newpassword">
								New Password{" "}
								<span style={{ color: "red" }}>*</span>
							</Form.Label>
							{/* <Tooltip
								style={{ paddingBottom: "0.5rem" }}
								title="Password must be more than 8 characters long with atleast 1 Uppercase letter, 1 Lowercase letter, 1 Symbol, and 1 Number.      Example : Allmaster@2023">
								<InfoIcon /> */}
							{/* </Tooltip> */}
						</div>
						<Controller
							name="password"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									type={
										passwordVisibile ? "text" : "password"
									}
									id="newpassword"
									className="form-control col-md-3"
									aria-describedby="newpassword"
									placeholder="Enter New Password"
									onPaste={preventInputEvents}
									onCopy={preventInputEvents}
									onCut={preventInputEvents}
									maxLength={16}
								/>
							)}
						/>
						<div
							className={styles.passicons}
							onClick={() => {
								togglePasswordVisiblity("password");
							}}>
							{passwordVisibile ? (
								<BsFillEyeSlashFill />
							) : (
								<AiFillEye />
							)}
						</div>
						{errors.password && (
							<p className="errormsg">
								{errors.password.message}
							</p>
						)}
					</Form.Group>
					<Form.Group className={`${styles.passiconposition} pt-2`}>
						<Form.Label
							className={styles.changepasslabel}
							htmlFor="confirmPassword">
							Confirm Password{" "}
							<span style={{ color: "red" }}>*</span>
						</Form.Label>
						<Controller
							name="confirmPassword"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									type={
										confirmPasswordVisibile
											? "text"
											: "password"
									}
									id="confirmPassword"
									className="form-control col-md-3"
									aria-describedby="confirmPassword"
									placeholder="Confirm New Password"
									onPaste={preventInputEvents}
									onCopy={preventInputEvents}
									onCut={preventInputEvents}
									maxLength={16}
								/>
							)}
						/>
						<div
							className={styles.conpassicons}
							onClick={() => {
								togglePasswordVisiblity("confirmPassword");
							}}>
							{confirmPasswordVisibile ? (
								<BsFillEyeSlashFill />
							) : (
								<AiFillEye />
							)}
						</div>
						{errors.confirmPassword && (
							<p className="errormsg">
								{errors.confirmPassword.message}
							</p>
						)}
					</Form.Group>
					<Form.Group
						className={`${styles.passiconposition} pt-2 pb-3`}>
						<Form.Label
							className={styles.changepasslabel}
							htmlFor="otp">
							Confirm OTP <span style={{ color: "red" }}>*</span>
						</Form.Label>
						<Controller
							name="otp"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									id="otp"
									className="form-control col-md-3"
									aria-describedby="otp"
									placeholder="Confirm OTP"
									maxLength={6}
								/>
							)}
						/>
						{errors.otp && (
							<p className="errormsg">{errors.otp.message}</p>
						)}
					</Form.Group>
					<div className="pt-1">
						{/* <TextCaptcha
							captcha={captcha}
							captchaValue={captchaValue}
							onChange={capthaOnChangeHandler}
							refreshCaptchaHandler={refreshCaptchaHandler}
						/> */}
						{/* <ReCAPTCHA
							className={styles.recaptcha}
							sitekey={import.meta.env.VITE_CAPTCHA_KEY}
							ref={reCaptchaRef}
							onChange={verify}
							onExpired={verify}
						/> */}
					</div>
					<Button
						// disabled={changepasswordData.isLoading}
						type="submit"
						className={`${styles.loginbtn} w-100`}>
						{/* {changepasswordData.isLoading ? (
							<CircularProgress />
						) : ( */}
							Continue
						{/* )} */}
					</Button>
				</Form>
			</div>
		</div>
	);
}

export default ChangePassword;

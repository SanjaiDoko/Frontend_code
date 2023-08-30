import styles from "./index.module.css";
// import Logo from "../../../assets/Images/AllMasterslogo.jpg";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { resetPasswordValidation } from "../../../validationSchema/resetPasswordValidation";
import { useResetpasswordData } from "../../../hooks/resetPassword";
// import { useMutation } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import { CircularProgress } from "@mui/material";
// import ReCAPTCHA from "react-google-recaptcha";
// import { fetchData } from "../../../helper";
// import { URL } from "../../../config";
// import { closePopup, openPopup } from "../../../redux/slices/popupSlice";
// import { useDispatch } from "react-redux";
// import Popup from "../../../components/ConfirmationPopup";
// import { TextCaptcha } from "../../../components/TextCaptcha";

function ResetPassword() {
  // const [captchaToken, setCaptchaToken] = useState(null);
  // const randomString = Math.random().toString(36).substring(2, 8);
  // const [captcha, setCaptcha] = useState(randomString);
  // const [validUser, setValidUser] = useState(false);
  // const [captchaValue, setCaptchValue] = useState("");
  // const reCaptchaRef = useRef(null);
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(resetPasswordValidation),
    mode: "onChange",
    defaultValues: {
      email: "",
      type: "",
    },
  });
  const navigate = useNavigate();
  const { mutate } = useResetpasswordData();
  // const dispatch = useDispatch();
  // const resetpasswordData = useMutation({
  // 	mutationFn: (data) => {
  // 		let payload = data;
  // 		payload.type = parseInt(data.type);
  // 		return fetchData(
  // 			{
  // 				url: URL + "user/forgotpasswordmail",
  // 				method: "POST",
  // 				isAuthRequired: true,
  // 			},
  // 			{ data: [payload] }
  // 		);
  // 	},
  // 	onSuccess: () => {
  // 		navigate("/check-inbox");
  // 	},
  // 	onError: (error) => {
  // 		toast.error(error.message.split(":")[1]);
  // 	},
  // });

  // const verify = (value) => {
  // 	setCaptchaToken(value);
  // };

  const onSubmit = (data) => {
    mutate(data);
    // if (import.meta.env.VITE_CAPTCHA === "true") {
    // 	if (!captchaValue) {
    // 		toast.error("Please Enter Captcha");
    // 	} else {
    // 		if (!validUser) {
    // 			toast.error("Invalid Captcha, please try again");
    // 		} else {
    // 			resetpasswordData.mutate(data);
    // 		}
    // 	}
    // } else {
    // 	resetpasswordData.mutate(data);
    // }
   };
  // const titleText = "Kind Note";
  // const contentText =
  // 	"Please know that we are currently operational only from Mumbai. Rest assured, we will soon be launching operations from more gateways. Stay tuned for further updates.";

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

  return (
    <div className={styles.maindiv}>
      <div className="container flexdiv">
        <div className={styles.newuser}>
          <p>
            Are you new here ?{" "}
            <button
              type="button"
              className={styles.forgot}
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </p>
        </div>
        <Form className={`${styles.form}`} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.Logodiv}>
            {/* <img
							src={Logo}
							alt="AllMasters Logo"
							className="masterlogo"
						/> */}
            <h5 className="pt-2">Reset Password</h5>
            <p>& take back control now</p>
          </div>
          <div className="form-group pt-2 pb-3">
            <Form.Group className="pt-2">
							<Form.Label htmlFor="type" className="formlabel">
								Type <span style={{ color: "red" }}>*</span>
							</Form.Label>
							<Controller
								name="type"
								control={control}
								render={({ field }) => (
									<Form.Select
										{...field}
										type="number"
										id="type"
										className="formcontrol">
										<option hidden>Select Type</option>
										<option value="1">
											I am a User
										</option>
										<option value="2">
											I am a Administrator
										</option>
									</Form.Select>
								)}
							/>
							{errors.type && (
								<span className="errormsg">
									{errors.type.message}
								</span>
							)}
						</Form.Group>
            <Form.Label htmlFor="InputEmail" className="pt-2">
              Email Address <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  type="text"
                  id="InputEmail"
                  className="form-control col-md-3"
                  aria-describedby="Enter email address block"
                  placeholder="Enter Email Address"
                />
              )}
            />
            {errors.email && <p className="errormsg">{errors.email.message}</p>}
          </div>
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
            // disabled={resetpasswordData.isLoading}
            type="submit"
            className={styles.loginbtn}
            id="Resetbtn"
          >
            {/* {resetpasswordData.isLoading ? (
							<CircularProgress />
						) : ( */}
            Reset Password
            {/* )} */}
          </Button>
          <Link to="/login"className={styles.gobacklink}>
            <div className={styles.goback}>Go back</div>
          </Link>
        </Form>
        {/* <Popup
					titleText={titleText}
					contentText={contentText}
					handleAgree={() => {
						navigate("/register");
						dispatch(closePopup());
					}}
					isLogin={true}
				/> */}
      </div>
    </div>
  );
}

export default ResetPassword;

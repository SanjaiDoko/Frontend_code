import styles from "./index.module.css";
import Logo from "../../../assets/Images/blacklogo.png";
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
import { CircularProgress } from "@mui/material";

function ChangePassword() {
  const [passwordVisibile, setPasswordVisibile] = useState(false);
  const { mutate, isLoading } = useChangepasswordData();
  const { id } = useParams();
  const [confirmPasswordVisibile, setConfirmPasswordVisibile] = useState(false);
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
    const payload = {
      id,
      password: data.password,
      otp: data.otp,
      type: Number(data.type),
    };
    mutate(payload);
  };

  const preventInputEvents = (e) => {
    e.preventDefault();
  };

  return (
    <div className={styles.maindiv}>
      <div className="container flexdiv">
        <Form id={`${styles.form} form`} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.Logodiv}>
            <img src={Logo} alt="AllMasters Logo" className="masterlogo" />
            <h5 className="pt-2">Change Password</h5>
            <p>& take back control now</p>
          </div>
          <Form.Group className={`${styles.passiconposition} pt-2`}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Form.Label
                className={styles.changepasslabel}
                htmlFor="newpassword"
              >
                New Password <span style={{ color: "red" }}>*</span>
              </Form.Label>
            </div>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  type={passwordVisibile ? "text" : "password"}
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
              }}
            >
              {passwordVisibile ? <BsFillEyeSlashFill /> : <AiFillEye />}
            </div>
            {errors.password && (
              <p className="errormsg">{errors.password.message}</p>
            )}
          </Form.Group>
          <Form.Group className={`${styles.passiconposition} pt-2`}>
            <Form.Label
              className={styles.changepasslabel}
              htmlFor="confirmPassword"
            >
              Confirm Password <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  type={confirmPasswordVisibile ? "text" : "password"}
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
              }}
            >
              {confirmPasswordVisibile ? <BsFillEyeSlashFill /> : <AiFillEye />}
            </div>
            {errors.confirmPassword && (
              <p className="errormsg">{errors.confirmPassword.message}</p>
            )}
          </Form.Group>
          <Form.Group className={`${styles.passiconposition} pt-2 pb-3`}>
            <Form.Label className={styles.changepasslabel} htmlFor="otp">
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
            {errors.otp && <p className="errormsg">{errors.otp.message}</p>}
          </Form.Group>
          <div className="pt-1"></div>
          <Button
            disabled={isLoading}
            type="submit"
            className={`${styles.loginbtn} w-100`}
          >
            {isLoading ? <CircularProgress /> : "Continue"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default ChangePassword;

import styles from "./index.module.css";
// import Logo from "../../../assets/Images/AllMasterslogo.jpg";
import { AiFillEye } from "react-icons/ai";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerValidation } from "../../../validationSchema/registerValidation";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import { fetchData } from "../../../helper";
// import { toast } from "react-toastify";
// import { URL } from "../../../config";
// import InfoIcon from "@mui/icons-material/Info";
// import { saveregistration } from "../../../api/registrationApi";
import { usePostRegistrationData } from "../../../hooks/register";
import Loader from "../../../components/Loader/Loader";

function Register() {
  const [passwordVisibile, setPasswordVisibile] = useState(false);
  const [confirmPasswordVisibile, setConfirmPasswordVisibile] = useState(false);
  const { mutate, isloading: registerLoading } = usePostRegistrationData();

  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(registerValidation),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
      role: 1,
    },
  });

  const togglePasswordVisiblity = (type) => {
    switch (type) {
      case "password":
        setPasswordVisibile(!passwordVisibile);
        break;
      case "confirmPassword":
        setConfirmPasswordVisibile(!confirmPasswordVisibile);
        break;
      default:
        break;
    }
  };

  const preventEvents = (e) => {
    e.preventDefault();
  };

  const onSubmit = (data) => {
    mutate(data);
  };
  if(registerLoading){
    return <Loader />
  }

  return (
    <div className={styles.maindiv}>
      <div className="container flexdiv">
        <div className={styles.newuser}>
          <p>Already have an account ? </p>
          <button
            type="button"
            className={styles.forgot}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
        <Form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.Logodiv}>
            <h5 className="pt-2">Get Started</h5>
            <p>Freight Logistics Simplified</p>
          </div>
          <div className={styles.forminputs}>
            <Form.Group className="pt-2">
              <Form.Label className={styles.registerlabels} htmlFor="fullname">
                Full Name <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="text"
                    id="fullname"
                    className="form-control col-md-3"
                    placeholder="ex. John Lin Doe"
                    autoComplete="new-password"
                  />
                )}
              />
              {errors.fullName && (
                <p className="errormsg">{errors.fullName.message}</p>
              )}
            </Form.Group>
            <Form.Group className="pt-2">
              <Form.Label
                className={styles.registerlabels}
                htmlFor="mobileCode"
              >
                Mobile Number <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Controller
                name="mobileNumber"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="text"
                    maxLength={10}
                    onChange={(event) =>
                      field.onChange(event.target.value.replace(/[^\d]+/g, ""))
                    }
                    id="phoneCode"
                    className={"form-control col-md-3"}
                    placeholder="Enter Mobile Number"
                    autoComplete="new-password"
                  />
                )}
              />
              {errors.mobileNumber && (
                <p className="errormsg">{errors.mobileNumber.message}</p>
              )}
            </Form.Group>
            <Form.Group className="pt-2">
              <Form.Label htmlFor="email" className={styles.registerlabels}>
                Email Address <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="email"
                    id="email"
                    className="form-control col-md-3"
                    placeholder="Enter Email Address"
                    autoComplete="new-password"
                  />
                )}
              />
              {errors.email && (
                <p className="errormsg">{errors.email.message}</p>
              )}
            </Form.Group>
            <Form.Group className={`${styles.iconposition} pt-2`}>
              <Form.Label htmlFor="Password" className={styles.registerlabels}>
                Password <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type={passwordVisibile ? "text" : "password"}
                    id="Password"
                    className="form-control col-md-3"
                    placeholder="Enter Password"
                    autoComplete="new-password"
                    onCut={preventEvents}
                    onCopy={preventEvents}
                    onPaste={preventEvents}
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
            <Form.Group className={`${styles.iconposition} pt-2`}>
              <Form.Label
                htmlFor="ConfirmPassword"
                className={styles.registerlabels}
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
                    id="ConfirmPassword"
                    className="form-control col-md-3"
                    placeholder="Enter Password"
                    autoComplete="new-password"
                    onCut={preventEvents}
                    onCopy={preventEvents}
                    onPaste={preventEvents}
                    maxLength={16}
                  />
                )}
              />
              <div
                className={styles.passicons}
                onClick={() => {
                  togglePasswordVisiblity("confirmPassword");
                }}
              >
                {confirmPasswordVisibile ? (
                  <BsFillEyeSlashFill />
                ) : (
                  <AiFillEye />
                )}
              </div>
              {errors.confirmPassword && (
                <p className="errormsg">{errors.confirmPassword.message}</p>
              )}
            </Form.Group>
          </div>
          <Button
            type="submit"
            id="Signin"
            className={`${styles.loginbtn} w-100 mt-3`}
          >
            Get Started
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Register;

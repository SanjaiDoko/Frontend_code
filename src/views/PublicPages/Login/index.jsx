import styles from "./index.module.css";
import { AiFillEye } from "react-icons/ai";
import Logo from "../../../assets/Images/AllMasterslogo.jpg";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidation } from "../../../validationSchema/loginValidation";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { useLoginData } from "../../../hooks/login";
import { CircularProgress } from "@mui/material";

const Loginpage = () => {
  const [passwordVisibile, setPasswordVisibile] = useState(false);
  const { mutate, isLoading } = useLoginData();
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(loginValidation),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      type: "1",
    },
  });
  const navigate = useNavigate();

  const onSubmit = (data) => {
    mutate(data);
  };

  function togglePasswordVisiblity() {
    setPasswordVisibile(!passwordVisibile);
  }

  const preventEvents = (e) => {
    e.preventDefault();
  };

  return (
    <>
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
          <Form
            id="form"
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={styles.Logodiv}>
              <img src={Logo} alt="AllMasters Logo" className="masterlogo" />
              <h5 className="pt-2">Welcome back !</h5>
              <p>Book & Track your shipments</p>
            </div>
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
                    className="formcontrol"
                  >
                    <option hidden>Select Type</option>
                    <option value="1">I am a User</option>
                    <option value="2">I am an Administrator</option>
                  </Form.Select>
                )}
              />
              {errors.type && (
                <span className="error">{errors.type.message}</span>
              )}
            </Form.Group>
            <Form.Group className="pt-2">
              <Form.Label htmlFor="InputEmail1">
                Email Address <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type="text"
                    id="InputEmail1"
                    className="form-control col-md-3"
                    aria-describedby="passwordHelpBlock"
                    placeholder="Enter Email Address"
                  />
                )}
              />
              {errors.email && (
                <p className="errormsg">{errors.email.message}</p>
              )}
            </Form.Group>
            <Form.Group className={`${styles.iconposition} pt-3`}>
              <Form.Label htmlFor="InputPassword1">
                Password <span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Form.Control
                    {...field}
                    type={passwordVisibile ? "text" : "password"}
                    id="InputPassword1"
                    className="form-control col-md-3"
                    aria-describedby="passwordHelpBlock"
                    placeholder="Enter Password"
                    onCut={preventEvents}
                    onCopy={preventEvents}
                    onPaste={preventEvents}
                    maxLength={16}
                  />
                )}
              />
              <div
                className={styles.icons}
                onClick={() => togglePasswordVisiblity()}
              >
                {passwordVisibile ? <BsFillEyeSlashFill /> : <AiFillEye />}
              </div>
              {errors.password && (
                <p className="errormsg">{errors.password.message}</p>
              )}
            </Form.Group>

            <div className="form-check pt-1 pb-2 d-flex justify-content-between">
              <div className={styles.checkdiv}>
                <input
                  hidden
                  type="checkbox"
                  className="form-check-input"
                  id="Check1"
                  style={{ marginTop: "6px" }}
                />
                <label hidden className="form-check-label" htmlFor="Check1">
                  Remember me
                </label>
              </div>
              <Link
                to="/resetpassword"
                className={styles.forgot}
                style={{ paddingTop: "6px" }}
              >
                Forgot Password?
              </Link>
            </div>
            <Button
              disabled={isLoading}
              type="submit"
              id="Signin"
              className={`${styles.loginbtn} w-100`}
            >
              {isLoading ? <CircularProgress /> : "Sign In"}
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Loginpage;

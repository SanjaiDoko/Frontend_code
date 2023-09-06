import styles from "./index.module.css";
import { AiFillEye } from "react-icons/ai";
import {ReactComponent as Logo} from "../../../assets/Images/mainlogo.svg";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidation } from "../../../validationSchema/loginValidation";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
// import { CircularProgress } from "@mui/material";
import AlreadyLoggedInPopup from "./alreadyLoggedInPopup";
import { useLogoutUser } from "../../../hooks/logout";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logInApi } from "../../../api/loginApi";
import jwtDecode from "jwt-decode";
import { useDispatch } from "react-redux";
import { setProfileData } from "../../../redux/slices/profileSlice";
import { toast } from "react-toastify";

const Loginpage = () => {
  const [passwordVisibile, setPasswordVisibile] = useState(false);
  const queryClient = useQueryClient();
  const [loggedInCheck, setLoggedInCheck] = useState({
    modal: false,
  });
  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
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
  const dispatch = useDispatch();
  const watchFields = watch();

  const { mutateAsync: logOut, isLoading: isLogOutLoading } = useLogoutUser(
    false,
    watchFields.type
  );

  function togglePasswordVisiblity() {
    setPasswordVisibile(!passwordVisibile);
  }

  const handleClose = () => {
    setLoggedInCheck({
      modal: false,
    });
    reset({ email: "", password: "", type: "1" });
  };

  const loginData = useMutation({
    mutationFn: (data) => logInApi(data),
    onSuccess: async (data) => {
      if (data.status === 1) {
        const parsedData = JSON.parse(data.data);
        const decodedData = jwtDecode(parsedData.token);
        localStorage.setItem("allMasterToken", parsedData.token);
        localStorage.setItem("allMasterId", parsedData.userId);
        localStorage.setItem("groupId", parsedData.groupId);
        data.role = decodedData.role;
        dispatch(setProfileData(decodedData));
        await queryClient.refetchQueries({ queryKey: ["profileData"] });
      } else {
        if (data.status === 0 && data.data != null) {
          localStorage.setItem("allMasterId", data.data);
          setLoggedInCheck({
            userId: data.data,
            modal: true,
          });
        } else {
          toast.error(data.response);
        }
      }
    },
    onError: (error) => {
      toast.error(error.message.split(":")[1]);
    },
  });

  const preventEvents = (e) => {
    e.preventDefault();
  };

  const handleAgree = async () => {
    await logOut(watchFields.type);
    await loginData.mutateAsync(watchFields);
  };

  const onSubmit = (data) => {
    loginData.mutate(data);
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
              <Logo className={styles.logo} />
              <h5 className="pt-2">Welcome back !</h5>
              <p>Raise & Resolve Tickets </p>
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
              type="submit"
              id="Signin"
              className={`${styles.loginbtn} w-100`}
            >
              Sign In
            </Button>
          </Form>
        </div>
        <AlreadyLoggedInPopup
          isLogOutLoading={isLogOutLoading || loginData.isLoading}
          handleAgree={handleAgree}
          handleClose={handleClose}
          modalOpen={loggedInCheck.modal}
        />
      </div>
    </>
  );
};

export default Loginpage;

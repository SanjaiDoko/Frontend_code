import styles from "./index.module.css";
import { AiFillEye } from "react-icons/ai";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidation } from "../../../validationSchema/loginValidation";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { useLoginData } from "../../../hooks/login";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import { useDispatch, useSelector } from "react-redux";
// import { setProfileData } from "../../../redux/slices/profileSlice";
// import jwtDecode from "jwt-decode";
// import { CircularProgress } from "@mui/material";
// import { logInApi } from "../../../api/logInApi";
// import { closePopup, openPopup } from "../../../redux/slices/popupSlice";
// import { closePopup as closeSessionPopup } from "../../../redux/slices/sessionPopupSlice";
// import Popup from "../../../components/ConfirmationPopup";
// import SessionTimeOutPopup from "./sessionTimeOut";


const Loginpage = () => {
  //   const queryClient = useQueryClient();
  //   const { state } = useLocation();
  const [passwordVisibile, setPasswordVisibile] = useState(false);
  const {mutate} = useLoginData();
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
  //   const popupStatus = useSelector((state) => state.sessionPopup.popupStatus);
  //   const dispatch = useDispatch();
  //   const titleText = "Kind Note";
  //   const contentText =
  //     "Please know that we are currently operational only from Mumbai. Rest assured, we will soon be launching operations from more gateways. Stay tuned for further updates.";

  //   const loginData = useMutation({
  //     mutationFn: (data) => logInApi(data),
  //     onSuccess: async (data) => {
  //       if (data.status === 1) {
  //         const parsedData = JSON.parse(data.data);
  //         const decodedData = jwtDecode(parsedData.token);
  //         localStorage.setItem("allMasterToken", parsedData.token);
  //         localStorage.setItem("allMasterId", parsedData.userId);
  //         data.role = decodedData.role;
  //         // dispatch(setProfileData(decodedData));
  //         await queryClient.refetchQueries({ queryKey: ["profileData"] });
  //         checkStatus(decodedData.status, decodedData.role);
  //       } else {
  //         if (data.status === 0 && data.data != null) {
  //           localStorage.setItem("allMasterId", data.data);
  //         } else {
  //           toast.error(data.response);
  //         }
  //       }
  //     },
  //     onError: (error) => {
  //       toast.error(error.message.split(":")[1]);
  //     },
  //   });

  //   function checkStatus(status, role) {
  //     switch (status) {
  //       case 1:
  //         checkRole(role);
  //         break;
  //       case 2:
  //       case 5:
  //         navigate("/kyc-verification");
  //         break;
  //       case 3:
  //       case 4:
  //       case 6:
  //         navigate("/verification");
  //         break;
  //       case 7:
  //         navigate("/verification");
  //         break;
  //       default:
  //         break;
  //     }
  //   }

  //   function checkRole(role) {
  //     switch (role) {
  //       case 1:
  //         navigate(state?.from != null ? state?.from : "/dashboard", {
  //           replace: true,
  //           state: {},
  //         });
  //         break;
  //       case 2:
  //         navigate("/admin/country");
  //         break;
  //       case 3:
  //         navigate("/obteam/users");
  //         break;
  //       case 4:
  //         navigate("/rdt/country");
  //         break;
  //       case 5:
  //         navigate("/ot/booking");
  //         break;
  //       case 6:
  //         navigate("/ocfs/mybookings");
  //         break;
  //       case 7:
  //         navigate(state?.from != null ? state?.from : "/mybookings", {
  //           replace: true,
  //           state: {},
  //         });
  //         break;
  //       default:
  //         break;
  //     }
  //   }

  const onSubmit = (data) => {
    mutate(data)
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
              {/* <img src={Logo} alt="AllMasters Logo" className="masterlogo" /> */}
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
                    <option value="1">I am a Customer</option>
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
              //   disabled={loginData.isLoading}
              type="submit"
              id="Signin"
              className={`${styles.loginbtn} w-100`}
            >
              {/* {loginData.isLoading ? <CircularProgress /> : */}
              Sign In
              {/* } */}
            </Button>
          </Form>
        </div>
      </div>
      {/* <SessionTimeOutPopup
        openSessionPopup={popupStatus}
        closeSessionPopup={() => dispatch(closeSessionPopup())}
      /> */}
      {/* <Popup
        titleText={titleText}
        contentText={contentText}
        handleAgree={() => {
          navigate("/register");
          dispatch(closePopup());
        }}
        isLogin={true}
      /> */}
    </>
  );
};

export default Loginpage;

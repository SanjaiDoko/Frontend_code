import styles from "./index.module.css";
import Logo from "../../../assets/Images/AllMasterslogo.jpg";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { resetPasswordValidation } from "../../../validationSchema/resetPasswordValidation";
import { useResetpasswordData } from "../../../hooks/resetPassword";
import { CircularProgress } from "@mui/material";

function ResetPassword() {
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
  const { mutate , isLoading } = useResetpasswordData();

  const onSubmit = (data) => {
    mutate(data);

   };

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
            <img
							src={Logo}
							alt="AllMasters Logo"
							className="masterlogo"
						/>
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
          <Button
            disabled={isLoading}
            type="submit"
            className={styles.loginbtn}
            id="Resetbtn"
          >
            {isLoading ? (
							<CircularProgress />
						) : 
           ' Reset Password'
            }
          </Button>
          <Link to="/login"className={styles.gobacklink}>
            <div className={styles.goback}>Go back</div>
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default ResetPassword;

/* eslint-disable react/prop-types */
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import styles from "./index.module.css";

export default function AlreadyLoggedInPopup({
  modalOpen,
  handleClose,
  handleAgree,
  isLogOutLoading,
}) {
  return (
    <Dialog open={modalOpen} onClose={handleClose}>
      <DialogTitle className={styles.title}>User Already Logged In</DialogTitle>
      <DialogContent>
        <DialogContentText className={styles.txtcontent}>
          The user is already logged in, do you want to log out all users?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button className={styles.yesbtn} onClick={handleAgree}>
          {isLogOutLoading ? <CircularProgress size={22} /> : "Yes"}
        </Button>
        <Button className={styles.nobtn} onClick={handleClose}>
          {isLogOutLoading ? <CircularProgress size={22}/> : "No"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

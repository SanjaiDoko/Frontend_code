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
        <DialogContentText>
          The user is already logged in, do you want to log out all users?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button className={styles.yesbtn} onClick={handleAgree}>
          {isLogOutLoading ? <CircularProgress /> : "Yes"}
        </Button>
        <Button className={styles.nobtn} onClick={handleClose}>
          {isLogOutLoading ? <CircularProgress /> : "No"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

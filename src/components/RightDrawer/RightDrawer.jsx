import { Drawer } from "@mui/material";
import "./RightDrawer.css";

function RightDrawer({ popup, children }) {
	return (
		<Drawer anchor={"right"} open={popup} sx={{ width: { sm: "400px" } }}>
			{children}
		</Drawer>
	);
}

export default RightDrawer;

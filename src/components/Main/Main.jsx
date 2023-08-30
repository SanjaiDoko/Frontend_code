import { styled } from "@mui/material/styles";

const drawerWidth = 350;

const Main = styled("main", {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open, ismobile }) => ({
	flexGrow: 1,
	width: `calc(100% - ${drawerWidth}px)`,
	transition: theme.transitions.create("margin", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	padding: 0,
	marginLeft: ismobile ? 0 : `-${drawerWidth}px`,
	...(open && {
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: 0,
	}),
}));

export default Main;

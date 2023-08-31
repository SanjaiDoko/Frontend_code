import { Outlet } from "react-router-dom";
import Header from "../Header/Header";


function InternalUserLayout() {

	return (
		<>
			<Header />
			<Outlet />
		</>
	);
}

export default InternalUserLayout;

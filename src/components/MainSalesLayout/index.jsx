import { Outlet } from "react-router-dom";
import SalesHeader from '../SalesHeader/index';

export default function MainUserLayout() {
	function redirectLink(role) {
		switch (role) {
			case 1:
				return "/sales/";
		}
	}

	return (
		<>
			<SalesHeader redirectLink={redirectLink} />
			<Outlet />
		</>
	);
}

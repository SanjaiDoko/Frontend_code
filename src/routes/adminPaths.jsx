import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "../components/Loader/Loader";

const userComponent = lazy(() =>
	import("../views/Admin/UserManagement/index")
);

const InternalUserLayoutComponent = lazy(() =>
	import("../components/InternalUserLayout/InternalUserLayout")
);

const adminPaths = [
	{
		path: "/admin",
		element: InternalUserLayoutComponent,
		children: [
			{
				path: "user",
				element: userComponent,
			},
			
		],
	},
];

export default function OperationAdminApp() {
	return (
		<Routes>
			{adminPaths.map((parentElement, index) => (
				<Route
					key={index}
					path={parentElement.path}
					element={<parentElement.element />}>
					{parentElement.children.map((element, index) => (
						<Route
							key={index}
							path={element.path}
							element={
								<Suspense fallback={<Loader />}>
									<element.element />
								</Suspense>
							}
						/>
					))}
				</Route>
			))}
			<Route
				path="*"
				element={<Navigate to="/admin/user" replace />}
			/>
		</Routes>
	);
}

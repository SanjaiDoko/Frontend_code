import { useState } from "react";
import styles from "./index.module.css";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import searchlogo from "../../../assets/Images/searchlogo.png";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { openSidebar } from "../../../redux/slices/sidebarSlice";
import { useGetAllUsers } from "../../../hooks/userManagement";
import Loader from "../../../components/Loader/Loader";
import ActiveButton from "../../../components/ActiveButton/ActiveButton";
import { convertFirstLettersAsUpperCase } from "../../../helper";
import moment from "moment";
// import { BiUndo } from "react-icons/bi";
// import { useInternalUser } from "../../hooks/internalUser";
// import Popup from "../../components/ConfirmationPopup/index";
// import { closePopup, openPopup } from "../../redux/slices/popupSlice";

function IndividualStatusUserList() {
	const [searchValue, setSearchValue] = useState("");
	const [selectBoxValue, setSelectedBoxValue] = useState("");
	// const [path, setPath] = useState("");
	// const date = moment().format("DD-MM-YYYY");
	// const userId = localStorage.getItem("allMasterId");
	const role = useSelector((state) => state.profile.role);
	// const { mutate: mutateUser } = useMutateUser(path);
	// const { data: userList, isLoading: userLoading } = useInternalUser();
	// const [selectedValue, setSelectedValue] = useState(
	// 	role === 3 ? [1, 3, 4, 5, 6, 7, 10] : [1, 4, 6, 7, 10]
	// );
	// const [confirmPopup, setConfirmPopup] = useState(false);
	// const [value, setValue] = useState(null);
	// const [titleText, setTitleText] = useState("");
	// const [contentText, setContentText] = useState("");
	const dispatch = useDispatch();
	// const navigate = useNavigate();
	const sidebar = useSelector((state) => state.sidebar);
	const { data, isLoading, isError, error } = useGetAllUsers();

	function filterArray(data) {
		if (data != null) {
			return data
				.sort((left, right) =>
					moment(right.approvedOn).diff(moment(left.approvedOn))
				)
				.filter(
					(e) =>
						e.fullName
							.toLowerCase()
							.replace(/\s/, "")
							.includes(
								searchValue.toLowerCase().replace(/\s/, "")
							) && e.userId == null
				);
		} else {
			return [];
		}
	}

	// function filterUsers(value, role) {
	// 	switch (role) {
	// 		case 2:
	// 			if (value === "") {
	// 				return [1, 4, 6, 7, 10];
	// 			} else {
	// 				return [value];
	// 			}
	// 		case 3:
	// 			if (value === "") {
	// 				return [1, 3, 4, 5, 6, 7, 10];
	// 			} else if (value === "pending") {
	// 				return [4];
	// 			} else if (value === "revalidate") {
	// 				return [5, 6];
	// 			} else if (value === "rejected") {
	// 				return [7, 10];
	// 			} else {
	// 				return [value];
	// 			}
	// 		default:
	// 			break;
	// 	}
	// }

	// const rowClickFunction = (data) => {
	// 	if (data.field !== "Action") {
	// 		navigate(
	// 			`/${role === 2 ? "admin" : "obteam"}/users/` + data.row._id
	// 		);
	// 	}
	// };

	const columns = [
		{
			field: "fullName",
			headerName: "FULL NAME",
			flex: 1,
			valueFormatter: ({ value }) =>
				convertFirstLettersAsUpperCase(value),
		},
		{ field: "mobileNumber", headerName: "MOBILE", width: 180 },
		{
			field: "email",
			headerName: "EMAIL",
			flex: 1,
		},
		{
			field: "status",
			headerName: "Status",
			flex: 1,
			renderCell: ({ value }) => (
				<ActiveButton status={value} user={true} obt={role === 3} />
			),
		},
	];
	// const deactivatedColumns = [
	// 	{
	// 		field: "legalName",
	// 		headerName: "COMPANY NAME",
	// 		flex: 1,
	// 		valueFormatter: ({ value }) =>
	// 			convertFirstLettersAsUpperCase(value),
	// 	},
	// 	{
	// 		field: "fullName",
	// 		headerName: "FULL NAME",
	// 		flex: 1,
	// 		valueFormatter: ({ value }) =>
	// 			convertFirstLettersAsUpperCase(value),
	// 	},
	// 	{ field: "mobileNumber", headerName: "MOBILE", width: 180 },
	// 	{
	// 		field: "email",
	// 		headerName: "EMAIL",
	// 		flex: 1,
	// 	},
	// 	{
	// 		field: "status",
	// 		headerName: "Status",
	// 		flex: 1,
	// 		renderCell: ({ value }) => (
	// 			<ActiveButton status={value} user={true} obt={role === 3} />
	// 		),
	// 	},
	// 	{
	// 		field: "Action",
	// 		headerName: "Action",
	// 		flex: 1,
	// 		renderCell: (value) => (
	// 			<BiUndo
	// 				className={styles.biundo}
	// 				onClick={() => {
	// 					setValue(value);
	// 					setPath("/admin/users/");
	// 					dispatch(openPopup());
	// 					setTitleText(" Restore User ?");
	// 					setContentText(
	// 						"Are you sure, You want to Restore this User ?"
	// 					);
	// 					setConfirmPopup(true);
	// 				}}
	// 			/>
	// 		),
	// 	},
	// ];

	// const openConfirmationPopup = () => {
	// 	if (confirmPopup === true) {
	// 		restoreUser();
	// 	}
	// };

	// const restoreUser = () => {
	// 	mutateUser({
	// 		id: value.row._id,
	// 		status: 3,
	// 		reason: {
	// 			message: " ",
	// 			role: `${userProfile[0].fullName}`,
	// 			time: date,
	// 			status: "Restored",
	// 			id: userId,
	// 		},
	// 	});
	// 	dispatch(closePopup());
	// };

	if (isLoading) {
		return <Loader />;
	}

	if (isError) {
		return <div>{error.message}</div>;
	}

	// const userProfile = userList.filter((e) => e._id === userId);

	return (
		<div className={styles.countrydiv}>
			<div className={styles.headingdiv}>
				<div className={styles.titlediv}>
					{!sidebar.sidebarStatus && (
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={() => dispatch(openSidebar())}
							className="icon">
							<MenuIcon />
						</IconButton>
					)}
					<h3 className={styles.title}>User Management</h3>
				</div>
			</div>
			<div className={styles.searchdiv}>
				<div className={styles.searchbox}>
					<img src={searchlogo} alt="searchlogo" />
					<input
						type="text"
						placeholder="Search by Full Name"
						onChange={(e) => setSearchValue(e.target.value)}
					/>
				</div>
				{/* {type === "allUsers" && ( */}
					<div className={styles.selectbox}>
						<h4>Filter by</h4>
						<div>
							<select
								style={{ background: "transparent" }}
								value={selectBoxValue}
								id="filterSelect"
								className={styles.selectuser}
								onChange={(e) => {
									setSelectedBoxValue(e.target.value);
									// setSelectedValue(
									// 	filterUsers(e.target.value, role)
									// );
								}}
                                >
								<option value={""}>All Users</option>
								<option value={role === 3 ? 3 : 4}>
									New Registration
								</option>
								{role === 3 && (
									<option value={"pending"}>Pending</option>
								)}
								<option value={role === 3 ? "revalidate" : 6}>
									Revalidated
								</option>
								<option value={1}>Approved</option>
								<option value={role === 3 ? "rejected" : 7}>
									{role === 3 ? "Rejected" : "OBT-Rejected"}
								</option>
								{role === 2 && (
									<option value={10}>De-Activated</option>
								)}
							</select>
						</div>
					</div>
				{/* )} */}
			</div>
			<div
				style={{
					height: 430,
					width: "100%",
					marginTop: "10px",
					borderRadius: "5px",
				}}>
				<DataGrid
					rows={filterArray(data)}
					columns={columns}
					initialState={{
						pagination: {
							paginationModel: {
								pageSize: 10,
							},
						},
					}}
					pageSizeOptions={[10]}
					loading={isLoading}
					getRowId={(row) => row._id}
					// onCellClick={rowClickFunction}
				/>
			</div>
			{/* <Popup
				setConfirmPopup={setConfirmPopup}
				handleAgree={() => openConfirmationPopup()}
				titleText={titleText}
				contentText={contentText}
			/> */}
		</div>
	);
}

export default IndividualStatusUserList;

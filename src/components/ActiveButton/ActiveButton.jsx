import React from "react";

function ActiveButton({ status, user, obt }) {
	let statusValue;
	let backgroundColor;
	if (user === true) {
		switch (status) {
			case 1:
				statusValue = "Accepted";
				backgroundColor = "green";
				break;
			case 3:
				statusValue = "New Registration";
				backgroundColor = "blue";
				break;
			case 4:
				if (obt === true) {
					statusValue = "Pending";
					backgroundColor = "blue";
				} else {
					statusValue = "New Registration";
					backgroundColor = "blue";
				}
				break;
			case 5:
				statusValue = "OBT Re-validated";
				backgroundColor = "yellow";
				break;
			case 6:
				statusValue = "Admin Re-validated";
				backgroundColor = "yellow";
				break;
			case 7:
				statusValue = "OBT Rejected";
				backgroundColor = "red";
				break;
			case 10:
				statusValue = "Admin Rejected";
				backgroundColor = "red";
				break;
			case 0:
				statusValue = "Pending";
				backgroundColor = "skyblue";
				break;
			default:
				break;
		}
	} else {
		switch (status) {
			case 2:
				statusValue = "Inactive";
				backgroundColor = "red";
				break;
			case 3:
				statusValue = "Inactive";
				backgroundColor = "red";
				break;
			case 1:
				statusValue = "Active";
				backgroundColor = "green";
				break;
			default:
				break;
		}
	}
	return (
		<div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
			<div
				style={{
					width: "7px",
					height: "7px",
					background: backgroundColor,
					borderRadius: "10px",
				}}></div>
			<span>{statusValue}</span>
		</div>
	);
}

export default ActiveButton;

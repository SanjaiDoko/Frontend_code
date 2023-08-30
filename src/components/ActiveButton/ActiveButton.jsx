// eslint-disable-next-line react/prop-types
function ActiveButton({ status }) {
  let statusValue;
  let backgroundColor;
  switch (status) {
    case 1:
      statusValue = "Active";
      backgroundColor = "green";
      break;
    case 2:
      statusValue = "InActive";
      backgroundColor = "red";
      break;
    default:
      break;
  }
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <div
        style={{
          width: "7px",
          height: "7px",
          background: backgroundColor,
          borderRadius: "10px",
        }}
      ></div>
      <span>{statusValue}</span>
    </div>
  );
}

export default ActiveButton;

// eslint-disable-next-line react/prop-types
function ActiveButton({ status }) {
  let statusValue;
  switch (status) {
    case 1:
      statusValue = "Active";
      break;
    case 2:
      statusValue = "InActive";
      break;
    default:
      break;
  }
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <span>{statusValue}</span>
    </div>
  );
}

export default ActiveButton;

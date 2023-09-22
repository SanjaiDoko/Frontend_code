import { ReactComponent as LoaderSvg } from "../../assets/Images/loader.svg";
import { ReactComponent as EodLoaderSvg } from "../../assets/Images/eodLoader.svg";
import { ReactComponent as RoomLoaderSvg } from "../../assets/Images/roomLoader.svg";
import { useSelector } from "react-redux";

export default function Loader() {
  const menu = useSelector((state) => state.menu.menu);
  function changeLoader(menu) {
    switch (menu) {
      case 1:
        return <LoaderSvg />;
      case 2:
        return <RoomLoaderSvg />;
      case 3:
        return <EodLoaderSvg />;
      // case 1:
      //     return <LoaderSvg />;
      // case 1:
      //     return <LoaderSvg />;

      default:
        break;
    }
  }
  return (
    <div
      className="loaderContainer"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      {changeLoader(menu)}
    </div>
  );
}

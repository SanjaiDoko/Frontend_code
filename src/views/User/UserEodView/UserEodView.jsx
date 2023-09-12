import { useParams } from "react-router-dom";
import styles from "./index.module.css";
import { useGetEodDetailsById } from "../../../hooks/eodHooks";
import Loader from "../../../components/Loader/Loader";

const UserEodView = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetEodDetailsById(id);

  if (isLoading) {
    return <Loader />;
  }
 
  console.log(data , 'data')

  return (
    <div className={styles.mainDiv}>
      <h1>Hello</h1>
    </div>
  );
};

export default UserEodView;

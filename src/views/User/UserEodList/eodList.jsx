import styles from "./index.module.css";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import { useGetEodById } from "../../../hooks/eodHooks";
import moment from "moment/moment";
import {TbMoodEmpty} from 'react-icons/tb';

function EodList() {
  const id = localStorage.getItem("allMasterId");

  const { data, isloading } = useGetEodById(id);

  const navigate = useNavigate();

  const columns = [
    {
      field: "index",
      flex: 1,
      headerName: "S.No.",
      width: 150,
    },

    {
      field: "eodDate",
      flex: 1,
      headerName: "Date",
      width: 200,
      renderCell: (params) => moment(params.row.eodDate).format("DD-MM-YYYY"),
    },
    {
      field: "eodSummary",
      flex: 1,
      headerName: "Hours",
      width: 200,
      renderCell: (params) => {
        let eodSummary = params.row.eodSummary;
        let totalHours = 0;
        for (let i = 0; i < eodSummary.length; i++) {
          totalHours += eodSummary[i].hours;
        }
        return `${totalHours} hr`;
      },
    },
    {
      flex: 1,
      field: "Options",
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <button
          className={styles.editBtn}
          onClick={() => navigate("eodstatus/" + params.row._id)}
        >
          View EOD
        </button>
      ),
    },
  ];

  if (isloading) {
    return <Loader />;
  }

  const generateRowsWithIndex = (data) => {
    return data.map((row, index) => {
      return { ...row, index: index + 1 };
    });
  };

  const rowClickFunction = (data) => {
    if (data.field === "Options") {
      navigate("/user/eodstatus/" + data.row._id);
    }
  };

  if (data !== undefined) {
    const rowsWithIndex = generateRowsWithIndex(data);

    return (
      <div className="container">
        <div className={styles.mainDiv}>
          <div className={styles.subDiv}>
            <h3>
              My EOD<sup>'</sup>s{" "}
            </h3>
            <button
              onClick={() => navigate("/user/eodstatus")}
              className={styles.addTicketBtn}
            >
              New EOD
            </button>
          </div>
          {data && data.length > 0 ? (
            <div className={styles.girdoverflow}>
              <DataGrid
                className={styles.dataGrid}
                sx={{ textTransform: "capitalize", minHeight: "450px" }}
                rows={rowsWithIndex}
                columns={columns}
                getRowId={(data) => data._id}
                hideFooterSelectedRowCount={true}
                onCellClick={(row) => rowClickFunction(row)}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
              />
            </div>
          ) : (
            <div className={styles.nodatafound}>
              <h4>Looks Empty</h4>
              <TbMoodEmpty style={{fontSize:'30px'}}/>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default EodList;

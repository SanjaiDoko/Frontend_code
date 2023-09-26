import { Form } from "react-bootstrap";
import styles from "./index.module.css";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import { useGetUserByGroupId } from "../../../hooks/groupManagement";
import { useEffect } from "react";
import { useGetEodsByMangerId } from "../../../hooks/eodHooks";
import moment from "moment/moment";
import Loader from "../../../components/Loader/Loader";

const ManagerEodView = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
    mode: "onChange",
  });

  const groupId = localStorage.getItem("groupId");
  const userId = localStorage.getItem("allMasterId");

  const {
    mutate: UserByGroupIdDataMutate,
    data: UserByGroupIdData,
    isLoading,
  } = useGetUserByGroupId();
  const {
    mutate: mutateUserEodList,
    data: userListEodData,
    isLoading: getEodLoading,
  } = useGetEodsByMangerId();

  useEffect(() => {
    UserByGroupIdDataMutate(groupId);
  }, []);

  const onSubmit = (data) => {
    data.managedBy = userId;
    data.managedBy = userId;
    data.startDate = moment(data.startDate).toISOString();
    data.endDate = moment(data.endDate).toString();
    mutateUserEodList(data);
  };

  if (getEodLoading || isLoading) {
    return <Loader />;
  }

  if (UserByGroupIdData !== undefined) {
    return (
      <div className="container">
        <div className={styles.mainDiv}>
          <h3>EOD Status</h3>
          <div className={styles.filterDiv}>
            <div className={styles.formdiv}>
              <form action="" onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="pt-2">
                  <Form.Label htmlFor="createdBy" className="formlabel">
                    Username
                  </Form.Label>
                  <Controller
                    name="createdBy"
                    control={control}
                    rules={{
                      required: "Username is required",
                    }}
                    render={({ field }) => (
                      <Form.Select
                        {...field}
                        style={{textTransform:'capitalize'}}
                        type="number"
                        id="createdBy"
                        className="formcontrol"
                      >
                        <option hidden>Select User</option>
                        {UserByGroupIdData &&
                          UserByGroupIdData.filter((e) => e.role == 1).map(
                            (e, i) => {
                              return (
                                <option key={i} value={e._id}>
                                  {e.fullName}
                                </option>
                              );
                            }
                          )}
                      </Form.Select>
                    )}
                  />
                  {errors?.createdBy && (
                    <p className="error">{errors.createdBy.message}</p>
                  )}
                </Form.Group>
                <Form.Group className="pt-2">
                  <Form.Label htmlFor="startDate" className="formlabel">
                    Start Date
                  </Form.Label>
                  <Controller
                    name="startDate"
                    control={control}
                    rules={{
                      required: "Start Date is required",
                    }}
                    render={({ field }) => (
                      <DatePicker
                        sx={{ width: "100%" }}
                        {...field}
                        format="DD-MM-YYYY"
                        disableFuture
                      />
                    )}
                  />
                  {errors?.startDate && (
                    <p className="error">{errors?.startDate.message}</p>
                  )}
                </Form.Group>
                <Form.Group className="pt-2">
                  <Form.Label htmlFor="endDate" className="formlabel">
                    End Date
                  </Form.Label>
                  <Controller
                    name="endDate"
                    control={control}
                    rules={{
                      required: "End Date is required",
                    }}
                    render={({ field }) => (
                      <DatePicker
                        sx={{ width: "100%" }}
                        {...field}
                        format="DD-MM-YYYY"
                        disableFuture
                      />
                    )}
                  />
                  {errors?.endDate && (
                    <p className="error">{errors?.endDate.message}</p>
                  )}
                </Form.Group>
                <button type="submit" className={styles.getDataBtn}>
                  Get data
                </button>
              </form>
            </div>
          </div>
          <div className={styles.eodMainDiv}>
            {userListEodData?.length === 0 && (
              <div className={styles.nodatafound}>
                <h4>Data Not Found</h4>
              </div>
            )}
            {userListEodData ? (
              userListEodData.map((e, i) => {
                return (
                  <div key={i} className={styles.eodList}>
                    <div className={styles.eoddatdiv}>
                      <span style={{ fontWeight: "bold" }}>Date :{"  "}</span>
                      <span>{moment(e.eodDate).format("DD-MM-YYYY")}</span>
                    </div>
                    <div>
                      <div key={i}>
                        <table className={styles.table}>
                          <tr>
                            <th className={styles.col1}>S.No</th>
                            <th className={styles.col2}>Task Description</th>
                            <th className={styles.col3}>Hours</th>
                          </tr>
                          {e.eodSummary &&
                            e.eodSummary.map((data, index) => {
                              return (
                                <tr key={index}>
                                  <td className={styles.col1}>{index + 1}</td>
                                  <td className={styles.col2}>
                                    {data.taskDescription}
                                  </td>
                                  <td className={styles.col3}>
                                    {data.hours}:
                                    {data.minutes <= 9
                                      ? `0${data.minutes}`
                                      : data.minutes}{" "}
                                    Hrs
                                  </td>
                                </tr>
                              );
                            })}
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.nodata}>
                <h3>Please Enter the User Details</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default ManagerEodView;

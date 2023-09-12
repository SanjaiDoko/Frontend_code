import { Form } from "react-bootstrap";
import styles from "./index.module.css";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import { useGetUserByGroupId } from "../../../hooks/groupManagement";
import { useEffect } from "react";
import { useGetEodsByMangerId } from "../../../hooks/eodHooks";
import moment from "moment/moment";

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

  const { mutate: UserByGroupIdDataMutate, data: UserByGroupIdData } =
    useGetUserByGroupId();
  const { mutate: mutateUserEodList, data: userListEodData } =
    useGetEodsByMangerId();

  useEffect(() => {
    UserByGroupIdDataMutate(groupId);
  }, []);

  const onSubmit = (data) => {
    data.managedBy = userId;
    mutateUserEodList(data);
  };


  if (UserByGroupIdData !== undefined) {
    return (
      <div className={styles.mainDiv}>
        <div className={styles.filterDiv}>
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="pt-2">
              <Form.Label htmlFor="createdBy" className="formlabel">
                Username
              </Form.Label>
              <Controller
                name="createdBy"
                control={control}
                rules={{
                  required: "username is required",
                }}
                render={({ field }) => (
                  <Form.Select
                    {...field}
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
                  required: "EOD Date is required",
                }}
                render={({ field }) => (
                  <DatePicker
                    sx={{ width: "100%" }}
                    {...field}
                    format="DD-MM-YYYY"
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

        <div className={styles.eodMainDiv}>
          {userListEodData ? (
            userListEodData.map((e, i) => {
              return (
                <div key={i} className={styles.eodList}>
                  <div>
                    <span style={{ fontWeight: "bold" }}>Date :{"  "}</span>
                    <span>{moment(e.eodDate).format("DD-MM-YYYY")}</span>
                  </div>
                  <div>
                    {e.eodSummary &&
                      e.eodSummary.map((data, index) => {
                        return (
                          <div key={i}>
                            <table className="table">
                              <tr>
                                <th>S.No</th>
                                <th>Task Description</th>
                                <th>Hours</th>
                              </tr>
                              <tr>
                                <td>{index + 1}</td>
                                <td>{data.taskDescription}</td>
                                <td>{data.hours}</td>
                              </tr>
                            </table>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })
          ) : (
            <span>empty view</span>
          )}
        </div>
      </div>
    );
  }
};

export default ManagerEodView;

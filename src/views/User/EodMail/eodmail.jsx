import styles from "./index.module.css";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import { Form } from "react-bootstrap";
import { DatePicker } from "@mui/x-date-pickers";
import { useMutateEod } from "../../../hooks/eodHooks";
import Loader from "../../../components/Loader/Loader";
import { toast } from "react-toastify";
import MenuItem from "@mui/material/MenuItem";
import { Checkbox } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import { useSelector } from "react-redux";
import { useGetAllReceivedTicketById } from "../../../hooks/ticketHooks";
import { useGetAllUsers } from "../../../hooks/userManagement";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      textTransform: "capitalize",
    },
  },
};

function EodMail() {
  let initialTaskData = {
    hours: "",
    minutes: "",
    taskDescription: "",
    taskStatus: "",
  };
  const id = localStorage.getItem("allMasterId");
  const role = useSelector((state) => state.profile.role);
  const {
    data,
    isLoading: ticketLoding,
    isSuccess: receivedTickets,
  } = useGetAllReceivedTicketById(id, role);
  const { data: usersData, isLoading: userDataLoading } = useGetAllUsers();

  const groupId = localStorage.getItem("groupId");
  const createdBy = localStorage.getItem("allMasterId");

  const { mutate, isLoading } = useMutateEod();

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      eodDate: null,
      tickets: [],
      ccMail: [],
      eodSummary: [
        {
          hours: "",
          minutes: "",
          taskDescription: "",
          taskStatus: "",
          tiketId: null,
        },
      ],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "eodSummary",
  });
  const onSubmit = (data) => {
    watch("eodSummary").map((eod) => {
      if (eod.hours === "0" && eod.minutes === "0") {
        return toast.error("Invalid task time");
      }
    });
    data.groupId = groupId;
    data.createdBy = createdBy;
    data.ccMail = data.ccMail
      ? data.ccMail.includes(",")
        ? data.ccMail.split(",")
        : [data.ccMail]
      : [];
    mutate(data);
  };
  function ticketHandler() {
    let arr = data?.filter((e) => watch("tickets").includes(e.ticketId));
    arr.map((e) =>
      append({
        hours: e.timeLog,
        minutes: e.timeLog,
        taskDescription: e.resolution,
        taskStatus: e.status,
        ticketId: e.ticketId,
      })
    );
    // remove(0);
  }

  if (isLoading || ticketLoding || userDataLoading) {
    return <Loader />;
  }

  return (
    <div className="container">
      <div className={styles.mainDiv}>
        <div className={styles.subDiv}>
          <h4>EOD Status</h4>
          <form action="">
            <div>
              <Form.Group className="pt-2">
                <Form.Label htmlFor="eodDate" className="formlabel">
                  EOD Date
                </Form.Label>
                <Controller
                  name="eodDate"
                  control={control}
                  rules={{
                    required: "EOD Date is required",
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
                {errors?.eodDate && (
                  <p className="error">{errors?.eodDate.message}</p>
                )}
              </Form.Group>
              <Form.Group className="pt-2">
                <Form.Label id="tickets">Includes Ticket EOD</Form.Label>
                <Controller
                  control={control}
                  name="tickets"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      fullWidth
                      id="tickets"
                      rules={{
                        required: "Hours is required",
                      }}
                      multiple
                      displayEmpty
                      value={value}
                      onChange={(e) => {
                        onChange(e);
                        ticketHandler(e);
                      }}
                      className={styles.costheadingSelect}
                      sx={{
                        fontSize: "14px",
                      }}
                      renderValue={(selected) => {
                        if (selected?.length === 0) {
                          return <span>Choose Tickets</span>;
                        }
                        return selected?.join(", ");
                      }}
                      MenuProps={MenuProps}
                    >
                      {data &&
                        data
                          ?.filter((e) => e.status === 1)
                          .map((e) => (
                            <MenuItem key={e._id} value={e.ticketId}>
                              <Checkbox
                                checked={
                                  watch("tickets")?.indexOf(e.ticketId) > -1
                                }
                              />
                              <ListItemText primary={e.ticketId} />
                            </MenuItem>
                          ))}
                    </Select>
                  )}
                />
                {/* <p className={styles.error}>{errors.emailcc?.message}</p> */}
              </Form.Group>
            </div>

            {fields?.map((item, index) => {
              return (
                <div
                  key={item.id}
                  style={
                    index > 0
                      ? {
                          borderTopStyle: "dotted",
                          marginTop: "20px",
                          borderWidth: "2px",
                          borderColor: "#D8D8D8",
                        }
                      : {}
                  }
                >
                  <div className={styles.formdiv}>
                    <div className={styles.inputDiv}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <h4 className={styles.package}>Task #{index + 1}</h4>
                        {index >= watch("tickets").length && index !== 0 && (
                          <DeleteIcon
                            sx={{
                              cursor: "pointer",
                              color: "#bababa",
                              marginTop: "20px",
                            }}
                            onClick={() => {
                              remove(index);
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <div className={styles.timediv}>
                          <Form.Group className="pt-2">
                            <Form.Label htmlFor="hours" className="formlabel">
                              Hours
                            </Form.Label>
                            <Controller
                              name={`eodSummary.${index}.hours`}
                              control={control}
                              rules={{
                                required: "Hours is required",
                                pattern: {
                                  value: /^[0-9]{1,2}$/i,
                                  message: "Accept Two Digit Only",
                                },
                              }}
                              render={({ field }) => (
                                <Form.Control
                                  {...field}
                                  style={{ textTransform: "capitalize" }}
                                  type="number"
                                  id="hours"
                                  placeholder="Enter Hours"
                                  onWheel={() => document.activeElement.blur()}
                                />
                              )}
                            />
                            {errors?.eodSummary?.[index]?.hours && (
                              <p className="error">
                                {errors.eodSummary[index].hours.message}
                              </p>
                            )}
                          </Form.Group>
                          <Form.Group className="pt-2">
                            <Form.Label htmlFor="minutes" className="formlabel">
                              Minutes
                            </Form.Label>
                            <Controller
                              name={`eodSummary.${index}.minutes`}
                              control={control}
                              rules={{
                                required: "Minutes is required",
                                validate: {
                                  checkLength: (value) =>
                                    value < 59 || "Enter Less than 59 Minutes",
                                },
                                pattern: {
                                  value: /^[0-9]{1,2}$/i,
                                  message: "Accept Two Digit Only",
                                },
                              }}
                              render={({ field }) => (
                                <Form.Control
                                  {...field}
                                  style={{ textTransform: "capitalize" }}
                                  type="number"
                                  id="minutes"
                                  placeholder="Enter Minutes"
                                  onWheel={() => document.activeElement.blur()}
                                />
                              )}
                            />
                            {errors?.eodSummary?.[index]?.minutes && (
                              <p className="error">
                                {errors.eodSummary[index].minutes.message}
                              </p>
                            )}
                          </Form.Group>
                        </div>
                        <Form.Group className="pt-2">
                          <Form.Label
                            htmlFor="taskDescription"
                            className="formlabel"
                          >
                            Task Description
                          </Form.Label>
                          <Controller
                            name={`eodSummary.${index}.taskDescription`}
                            control={control}
                            rules={{
                              required: "Task Description is required",
                              validate: (value) => {
                                return (
                                  !!value.trim() ||
                                  "Task Description is required"
                                );
                              },
                            }}
                            render={({ field }) => (
                              <Form.Control
                                type="text"
                                styles={{ textTransform: "capitalize" }}
                                {...field}
                                id="taskDescription"
                                placeholder="Enter Task Description"
                              />
                            )}
                          />
                          {errors?.eodSummary?.[index]?.taskDescription && (
                            <p className="error">
                              {errors.eodSummary[index].taskDescription.message}
                            </p>
                          )}
                        </Form.Group>
                        <Form.Group className="pt-2">
                          <Form.Label htmlFor="status" className="formlabel">
                            Task Status{" "}
                          </Form.Label>
                          <Controller
                            name={`eodSummary.${index}.taskStatus`}
                            control={control}
                            render={({ field }) => (
                              <Form.Select
                                className={`formcontrol`}
                                style={{ textTransform: "capitalize" }}
                                {...field}
                                id="taskStatus"
                                tabIndex={-1}
                              >
                                <option value="" hidden>
                                  Choose Task Status
                                </option>
                                <option value={1}>Completed</option>
                                <option value={2}>In Progress</option>
                              </Form.Select>
                            )}
                          />
                          {errors?.eodSummary?.[index]?.taskStatus && (
                            <span className={styles.error}>
                              {errors.eodSummary[index].taskStatus.message}
                            </span>
                          )}
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <Form.Group className="pt-2">
              <Form.Label id="ccMail">
                CC Mail <span className={styles.optionaltxt}>(Optional)</span>
              </Form.Label>
              <Controller
                control={control}
                name="ccMail"
                render={({ field: { onChange, value } }) => (
                  <Select
                    fullWidth
                    id="ccMail"
                    multiple
                    displayEmpty
                    value={value}
                    onChange={onChange}
                    className={styles.costheadingSelect}
                    sx={{
                      fontSize: "14px",
                    }}
                    renderValue={(selected) => {
                      if (selected?.length === 0) {
                        return <span>Choose Users</span>;
                      }
                      return selected?.join(", ");
                    }}
                    MenuProps={MenuProps}
                  >
                    {usersData &&
                      usersData
                        .filter((user) => user._id != createdBy)
                        .map((user) => (
                          <MenuItem key={user._id} value={user.email}>
                            <Checkbox
                              checked={
                                watch("ccMail")?.indexOf(user.email) > -1
                              }
                            />
                            <ListItemText primary={user.fullName} />
                          </MenuItem>
                        ))}
                  </Select>
                )}
              />
              <p className={styles.error}>{errors.ccMail?.message}</p>
            </Form.Group>
            <div className={styles.buttonDiv}>
              <button
                className={styles.addanother}
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  append(initialTaskData);
                }}
              >
                Add Another Task
              </button>
              <button
                type="submit"
                className={styles.addTicketBtn}
                onClick={handleSubmit(onSubmit)}
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EodMail;

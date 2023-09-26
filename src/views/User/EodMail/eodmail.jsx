import styles from "./index.module.css";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import { Form } from "react-bootstrap";
import { DatePicker } from "@mui/x-date-pickers";
import { useMutateEod } from "../../../hooks/eodHooks";
import Loader from "../../../components/Loader/Loader";
import { toast } from "react-toastify";

function EodMail() {
  const initialTaskData = {
    hours: "",
    minutes: "",
    taskDescription: "",
  };

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
      eodSummary: [
        {
          hours: "",
          minutes: "",
          taskDescription: "",
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

  if (isLoading) {
    return <Loader />;
  }

  return (
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
          </div>

          {fields.map((item, index) => {
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
                      {index !== 0 && (
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
                              validate: {
                                checkLength: (value) =>
                                  value < 18 || "Enter Less than 18 hours",
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
                                !!value.trim() || "Task Description is required"
                              );
                            },
                          }}
                          render={({ field }) => (
                            <Form.Control
                              type="text"
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
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <Form.Group className="pt-2">
            <Form.Label htmlFor="ccMail" className="formlabel">
              CC Mail <span className={styles.optionaltxt}>(Optional)</span>
            </Form.Label>
            <Controller
              name="ccMail"
              control={control}
              rules={{
                pattern: {
                  value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                  message: "Enter Valid Email Id",
                },
              }}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  type="text"
                  id="ccMail"
                  placeholder="Enter CC Mail"
                />
              )}
            />
            {errors?.ccMail && (
              <p className="error">{errors?.ccMail.message}</p>
            )}
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
  );
}

export default EodMail;

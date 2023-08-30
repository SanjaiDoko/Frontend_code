import { Form } from "react-bootstrap";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ReactComponent as CloseIcon } from "../../../assets/Icons/closeIcon.svg";
import styles from "./index.module.css";
import { groupValidation } from "../../../validationSchema/groupValidation";
import { useInsertGroup, useUpdateGroup } from "../../../hooks/groupManagement";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import { Checkbox } from "@mui/material";

const AddAndEditGroup = ({
  onCloseButtonClick,
  editData,
  isEdit,
  managedData,
  type,
}) => {
  console.log(type, "type");
  const { mutate: insertMutate, isLoading: insertLoading } = useInsertGroup();
  const { mutate: updateMutate, isLoading: updateLoading } = useUpdateGroup();

  const {
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm({
    resolver: yupResolver(groupValidation),
    mode: "onTouched",
    defaultValues: {
      grpName: isEdit ? editData.name : "",
      managedBy: isEdit ? editData.users[0] : "",
      users: isEdit ? editData.users[0] : [],
      status: isEdit ? `${editData.status}` : "1",
    },
  });
  function onSubmit(data) {
    if (isEdit) {
      const payload = {
        name: data.grpName,
        managedBy: data.managedBy,
        users: data.users.map((e) => e._id),
        status: data.status,
        id: editData._id,
      };
      //   console.log(payload, "payload");
      updateMutate(payload);
    } else {
      const payload = {
        name: data.grpName,
        managedBy: data.managedBy,
        users: data.users.map((e) => e._id),
        status: data.status,
      };
      //   console.log(payload, "payload");
      insertMutate(payload);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.addDiv}>
      <div>
        <div className={styles.addDivHeading}>
          <div>
            <h3 className={styles.addtitle}>Add Group</h3>
          </div>
          <CloseIcon
            type="button"
            onClick={() => {
              onCloseButtonClick();
            }}
            style={{ cursor: "pointer" }}
          />
        </div>
        <Form.Group className="pt-2">
          <Form.Label htmlFor="grpname" className="formlabel">
            Group Name
          </Form.Label>
          <Controller
            name="grpName"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                id="grpname"
                placeholder="Enter Group Name"
              />
            )}
          />
          {errors.grpName && (
            <span className="error">{errors.grpName.message}</span>
          )}
        </Form.Group>
        <Form.Group className="pt-2">
          <Form.Label htmlFor="type" className="formlabel">
            Managered By
          </Form.Label>
          <Controller
            name="managedBy"
            control={control}
            render={({ field }) => (
              <Form.Select
                style={{ textTransform: "capitalize" }}
                {...field}
                id="type"
                value={watch("type")}
                className="formcontrol"
              >
                <option value="">Select Managed By</option>
                {managedData &&
                  managedData.map((e) => (
                    <>
                      <option value={e._id}>{e.fullName}</option>
                    </>
                  ))}
                ;
              </Form.Select>
            )}
          />
          {errors.managedBy && (
            <span className="error">{errors.managedBy.message}</span>
          )}
        </Form.Group>
        {type === "edit" ? (
          <Form.Group className="pt-2">
            <Form.Label htmlFor="users">Users</Form.Label>
            <Controller
              control={control}
              name="users"
              render={({ field }) => (
                <Form.Control
                  style={{ textTransform: "capitalize" }}
                  disabled
                  {...field}
                  type="text"
                  id="users"
                  className="formcontrol"
                  placeholder="Enter Cost Heading"
                />
              )}
            />
            <p className={styles.error}>{errors.users?.message}</p>
          </Form.Group>
        ) : (
          <Form.Group className="pt-2">
            <Form.Label htmlFor="users">Users</Form.Label>
            <Controller
              control={control}
              name="users"
              render={({ field: { onChange, value } }) => (
                <Select
                  fullWidth
                  id="users"
                  multiple
                  displayEmpty
                  value={value}
                  onChange={onChange}
                  className={styles.costheadingSelect}
                  sx={{
                    textTransform: "capitalize",
                    fontSize: "14px",
                  }}
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <span>Choose Users</span>;
                    }
                    return selected.map((e) => e.fullName).join(", ");
                  }}
                  // MenuProps={MenuProps}
                >
                  {managedData.map((e) => (
                    <MenuItem key={e.id} value={e}>
                      <Checkbox
                        checked={
                          watch("users")
                            .map((data) => data.fullName)
                            .indexOf(e.fullName) > -1
                        }
                      />
                      <ListItemText primary={e.fullName} />
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <p className={styles.error}>{errors.users?.message}</p>
          </Form.Group>
        )}
        <div className="pt-4">
          <ToggleButtonGroup
            sx={{ width: "100%" }}
            // value={alignment}
            exclusive
            // onChange={handleAlignment}
            aria-label="text alignment"
            className="togglebtn"
          >
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <ToggleButton
                  {...field}
                  sx={{ width: "50%" }}
                  selected={field.value === "1"}
                  className="togglechildbtn"
                  value="1"
                  aria-label="left aligned"
                >
                  Active
                </ToggleButton>
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <ToggleButton
                  {...field}
                  sx={{ width: "50%" }}
                  selected={field.value === "2"}
                  className="togglechildbtn"
                  value="2"
                  aria-label="centered"
                >
                  Deactive
                </ToggleButton>
              )}
            />
          </ToggleButtonGroup>
        </div>
      </div>
      <button
        className={styles.savebtn}
        type="submit"
        disabled={insertLoading || updateLoading}
      >
        Add Ticket
      </button>
    </form>
  );
};

export default AddAndEditGroup;

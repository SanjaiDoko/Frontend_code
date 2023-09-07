import { Form } from "react-bootstrap";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ReactComponent as CloseIcon } from "../../../assets/Icons/closeIcon.svg";
import styles from "./index.module.css";
import {
  addGroupValidation,
  editGroupValidation,
} from "../../../validationSchema/groupValidation";
import { Multiselect } from "multiselect-react-dropdown";
import { MdDeleteForever } from "react-icons/md";
import {
  useGetUserByGroupId,
  useInsertGroup,
  useRemoveUserById,
  useUpdateGroup,
} from "../../../hooks/groupManagement";
import { useEffect, useState } from "react";
import { useGetAllUsers } from "../../../hooks/userManagement";
import Loader from "../../../components/Loader/Loader";
import { CircularProgress } from "@mui/material";

const AddAndEditGroup = ({ onCloseButtonClick, editData, isEdit, type }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedUser, setselectedUser] = useState([]);

  const onSelectOptions = (selectedList, selectedItem, onChange) => {
    onChange([...selectedList, selectedItem]);
  };
  const onRemoveOptions = (selectedList, removedItem, onChange) => {
    onChange([...selectedList, removedItem]);
  };

  const { mutate: insertMutate, isLoading: insertLoading } =
    useInsertGroup(onCloseButtonClick);
  const {
    data: userList,
    isLoading: userLoading,
    refetch: userRefetch,
  } = useGetAllUsers();

  const { mutate: updateMutate, isLoading: updateLoading } =
    useUpdateGroup(onCloseButtonClick);

  const {
    mutate: UserByGroupIdDataMutate,
    data: UserByGroupIdData,
    isLoading: getUserByGroupIdLoading,
  } = useGetUserByGroupId();

  const { mutate: removeUserMuate, isLoading: removeLoader } =
    useRemoveUserById();

  const managedData = userList.filter((e) => e.status === 1);
  const {
    handleSubmit,
    formState: { errors },
    watch,
    clearErrors,
    control,
  } = useForm({
    resolver: yupResolver(isEdit ? editGroupValidation : addGroupValidation),
    mode: "onTouched",
    defaultValues: {
      grpName: isEdit ? editData.name : "",
      managedBy: isEdit
        ? UserByGroupIdData &&
          UserByGroupIdData?.filter((e) => e.role === 3)?.map((e) => e._id)[0]
        : "",
      users: isEdit ? editData.users[0] : "",
      status: isEdit ? `${editData.status}` : "1",
    },
  });

  useEffect(() => {
    userRefetch();
    if (isEdit) {
      UserByGroupIdDataMutate(editData?.groupId);
      clearErrors("managedBy");
    }
    setOptions(
      managedData
        .filter((e) => e.groupId === null && e._id !== watch("managedBy"))
        .map((e) => {
          return { name: e.fullName, id: e._id };
        })
    );
  }, [watch("managedBy"), userList]);

  function onSubmit(data) {
    if (isEdit) {
      const payload = {
        name: data.grpName,
        managedBy:
          UserByGroupIdData &&
          UserByGroupIdData?.filter((e) => e.role === 3)?.map((e) => e._id)[0],
        users: selectedUser.map((e) => e.id),
        status: data.status,
        id: editData.groupId,
      };
      updateMutate(payload);
    } else {
      data.users.pop();
      const payload = {
        name: data.grpName,
        managedBy: data.managedBy,
        users: data.users.map((e) => e.id),
        status: data.status,
      };
      insertMutate(payload);
    }
  }
  if (userLoading || getUserByGroupIdLoading) {
    return <Loader />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.addDiv}>
      <div>
        <div className={styles.addDivHeading}>
          <div>
            <h3 className={styles.addtitle}>{isEdit ? "Edit" : "Add"} Group</h3>
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
                style ={{textTransform:"capitalize"}}
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
          Manager
          </Form.Label>
          <Controller
            name="managedBy"
            control={control}
            render={({ field }) => (
              <Form.Select
                disabled={editData}
                style={{ textTransform: "capitalize" }}
                {...field}
                id="type"
                value={watch("type")}
                className="formcontrol"
              >
                {editData ? (
                  <>
                    {UserByGroupIdData &&
                      UserByGroupIdData?.filter((e) => e.role === 3)?.map(
                        (e) => (
                          <>
                            <option value={e._id} style ={{textTransform:"capitalize"}}>{e.fullName}</option>
                          </>
                        )
                      )}
                  </>
                ) : (
                  <>
                    <option value="">Select Managed By</option>
                    {managedData
                      .filter((e) => e.groupId === null)
                      .map((e) => (
                        <>
                          <option value={e._id} style ={{textTransform:"capitalize"}}>{e.fullName}</option>
                        </>
                      ))}
                  </>
                )}
                ;
              </Form.Select>
            )}
          />
          {errors.managedBy && (
            <span className="error">{errors.managedBy.message}</span>
          )}
        </Form.Group>
        <Form.Group className="pt-2">
          <Form.Label htmlFor="type" className="formlabel">
            Members
          </Form.Label>
          <Controller
            name="users"
            control={control}
            render={({ field }) => (
              <Multiselect
                {...field}
                options={options}
                value={options}
                name="users"
                onSelect={(selectedList, selectedItem) => {
                  setselectedUser(selectedList);
                  onSelectOptions(selectedList, selectedItem, field.onChange);
                }}
                onRemove={(selectedList, selectedItem) =>
                  onSelectOptions(selectedList, selectedItem, field.onChange)
                }
                displayValue="name"
                closeIcon="cancel"
                placeholder="Select Options"
                selectedValues={selectedOptions}
                className="multiSelectContainer"
              />
            )}
          />
          {errors.managedBy && (
            <span className="error">{errors.managedBy.message}</span>
          )}
        </Form.Group>
        {editData && (
          <div className="pt-3">
            Assigned Users
            {UserByGroupIdData &&
              UserByGroupIdData.filter((e) => e.role === 1).map((e) => {
                return (
                  <>
                    <div className={styles.assignedUserdiv}>
                      <p>{e.fullName}</p>
                      {removeLoader ? (
                        <CircularProgress />
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeUserMuate(e._id)}
                        >
                          <MdDeleteForever style={{color:'#898989' , fontSize:'20px'}} />
                        </button>
                      )}
                    </div>
                  </>
                );
              })}
          </div>
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
        {insertLoading || updateLoading ? (
          <CircularProgress />
        ) : isEdit ? (
          "Update Group"
        ) : (
          "Add Group"
        )}
      </button>
    </form>
  );
};

export default AddAndEditGroup;

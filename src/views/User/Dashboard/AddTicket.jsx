import { useState } from "react";
import { InputGroup, Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ReactComponent as CloseIcon } from "../../../assets/Icons/closeIcon.svg";
import classes from "./index.module.css";

const AddAndEditLane = ({ setPopup }) => {
  const {
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm({
    resolver: yupResolver(),
    mode: "onTouched",
    defaultValues: {},
  });

  return (
    <form onSubmit={handleSubmit()} className={classes.addDiv}>
      <div>
        <div className={classes.addDivHeading}>
          <CloseIcon
            type="button"
            onClick={() => {
              setPopup(null);
            }}
            style={{ cursor: "pointer" }}
          />
        </div>
        <Form.Group className="pt-2">
          <Form.Label htmlFor="Currency" className="formlabel">
            CFS Name
          </Form.Label>
          <Controller
            name="cfsName"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                id="cfsName"
                placeholder="Enter CFS Name"
              />
            )}
          />
        </Form.Group>
        <Form.Group className="pt-2">
          <Form.Label htmlFor="ExchangeRate" className="formlabel">
            CFS Branch Name
          </Form.Label>
          <Controller
            name="cfsBranch"
            control={control}
            render={({ field }) => (
              <Form.Control
                type="text"
                {...field}
                id="cfsBranch"
                placeholder="Enter CFS Branch Name"
              />
            )}
          />
          {errors.cfsBranch && (
            <span className="error">{errors.cfsBranch.message}</span>
          )}
        </Form.Group>

        <Form.Group className="pt-2">
          <Form.Label htmlFor="type" className="formlabel">
            Issue Name
          </Form.Label>
          <Controller
            name="issueName"
            control={control}
            render={({ field }) => (
              <Form.Select
                style={{ textTransform: "capitalize" }}
                {...field}
                id="type"
                value={watch("type")}
                className="formcontrol"
              >
                <option value={1}>gateway</option>
                <option value={2}>destination</option>
              </Form.Select>
            )}
          />
          {errors.type && <span className="error">{errors.type.message}</span>}
        </Form.Group>
      </div>
      <button type="submit">Add Ticket</button>
    </form>
  );
};

export default AddAndEditLane;

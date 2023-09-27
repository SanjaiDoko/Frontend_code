import { useForm } from "react-hook-form";
import { Schema } from "../../../validationSchema/requirementValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./index.module.css";
export default function Newrequirement() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Schema),
  });
  const onSubmit = async (data) => {
    const response = await fetch("http://localhost:7000/requirement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [
          {
            subject: data.subject,
            description: data.description,
          },
        ],
      }),
    });
  };

  return (
    <div className="container">
      <div className={styles.maindiv}>
        <div className={styles.adddiv}>
        <h2>New Requirement</h2>
        <div className={styles.NRcontainer}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.insideNR}>
              <label className={styles.label}>Subject</label>
              <input className={styles.forminput} {...register("subject")}></input>
              {errors.subject && (
                <p className={styles.error}>{errors.subject.message}</p>
              )}
              <label className={styles.label}>Reqiurements</label>
              <textarea className={styles.forminput} {...register("description")}></textarea>
              {errors.description && (
                <p className={styles.error}>{errors.description.message}</p>
              )}
              <button type="Submit" className={styles.btn}>Create Requirement</button>
            </div>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
}

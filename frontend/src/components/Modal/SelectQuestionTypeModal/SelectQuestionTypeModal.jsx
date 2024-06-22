import React from "react";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import { useForm } from "react-hook-form";
import styles from "./selectQuestionTypeModal.module.scss";
import Select from "../../Select/Select";

const SelectQuestionTypeModal = (props) => {
  const { handleClose, onAddNewObject,onSelectFromLibrary} = props;
  const [types, setTypes] = React.useState([]);
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm();
  return (
    <div className={styles["modal-content"]}>
      {/* <div className={styles["delete-icon"]}>
        <DeleteIcon color="error" fontSize="large" />
      </div> */}
      <p>Select the type of question</p>

      <div>
        <Button variant="outlined" onClick={handleClose}>
          <ClearIcon />
          <span>cancel</span>
        </Button>
        <Select
                label="question type"
                name="type"
                register={register}
                errors={errors}
              >
                {types.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
        </Select>
      </div>
    </div>
  );
};

export default SelectQuestionTypeModal;

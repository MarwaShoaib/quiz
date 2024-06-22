import React from "react";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";

import styles from "./addQuestionModal.module.scss";

const AddQuestionModal = (props) => {
  const { handleClose, onAddNewObject,onSelectFromLibrary} = props;
  return (
    <div className={styles["modal-content"]}>
      {/* <div className={styles["delete-icon"]}>
        <DeleteIcon color="error" fontSize="large" />
      </div> */}
      <h4>Add Question</h4>
      <p>Select the way want to add the question by it</p>

      <div>
        <Button variant="outlined" onClick={handleClose}>
          <ClearIcon />
          <span>cancel</span>
        </Button>
        <Button variant="contained" color="info"  onClick={onAddNewObject}>
          <span>Add new Question</span>
        </Button>
        <Button variant="contained" color="info"  onClick={onSelectFromLibrary}>
          <span>Select from Question-Bank</span>
        </Button>
      </div>
    </div>
  );
};

export default AddQuestionModal;

import React from "react";
import { Link } from "react-router-dom";
import TableForRoomQuiz from "../../components/Table/TableForRoomQuiz";

import styles from "./homForQuizRoom.module.scss";

const HomForQuizRoom = () => {
  return (
    <div className={`container  ${styles.home}`}>
      <div className={styles.questionType}>
        <p>The Quiz Room : </p>
      </div>
      <TableForRoomQuiz />
    </div>
  );
};

export default HomForQuizRoom;

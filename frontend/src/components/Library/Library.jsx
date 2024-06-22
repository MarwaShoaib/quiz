import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import styles from "./library.module.scss";
import { Button, Checkbox, IconButton } from "@mui/material";
import {
  RadioButtonCheckedRounded,
  Delete,
  CheckBox,
} from "@mui/icons-material";
import Modal from "../Modal/Modal";
import DeleteModalContent from "../Modal/DeleteModalContent/DeleteModalContent";
import axios from "../../axios";
import { toast } from "react-toastify";

export default function DataLibrary(props) {
  const navigate = useNavigate();
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedRowIds, setSelectedRowIds] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [activeQuestion, setActiveQuestion] = React.useState();

  const closeModal = () => setShowModal(false);
  const openModal = () => setShowModal(true);

  const onDeleteQuestion = (id) => {
    openModal();
    setActiveQuestion(id);
  };

  const onConfirmDelete = async () => {
    closeModal();
    try {
      const res = await axios.delete(`/question/${activeQuestion}`);
      console.log(res.data);
      toast.success("Question deleted successfully");
      await fetchQuestions();
    } catch (error) {
      console.log(error);
    }
  };

  const renderColorStatus = (status) => {
    let color = { backgroundColor: "black" };
    if (status === "g") {
      color = { backgroundColor: "green" };
    } else if (status === "y") {
      color = { backgroundColor: "yellow" };
    } else if (status === "r") {
      color = { backgroundColor: "red" };
    }
    return color;
  };

  const columns = [
    {
      field: "col0",
      headerName: "",
      width: 100,
      renderCell: (params) => (
        <Checkbox
          // checked={params.id == setSelectedRowId}
          value={params.id}
          onChange={(e) => {
            // setSelectedRowId(e.target.value);
            setSelectedRowIds((prevSelectedIds) => [
              ...prevSelectedIds,
              e.target.value,
            ]);

            console.log(e.target.checked);
            e.target.checked = true;
          }}
        />
      ),
    },
    {
      field: "name",
      headerName: "Title",
      width: 200,
      renderCell: (params) => {
        return <Link to={`/show/${params.id}`}>{params.row.name}</Link>;
      },
    },
    {
      field: "type",
      headerName: "Type",
      width: 200,
    },
    {
      field: "domain",
      headerName: "Domain",
      width: 250,
    },
    {
      field: "subDomain",
      headerName: "Sub Domain",
      width: 230,
    },
    {
      field: "dateModified",
      headerName: "Date Modified",
      width: 200,
    },
  ];
  console.log(selectedRowIds);

  const fetchQuestions = React.useCallback(async () => {
    setLoading(true);
    const res = await axios.get(`/isAnswered`);
    const data = res.data;
    console.log(data[0]);
    if (!!data.length) {
      setRows(
        data.map((item) => ({
          id: item._id,
          name: item.questionName,
          type: item.type,
          domain: item.domainName,
          subDomain: item.subDomainName,
          dateModified: new Date(item.createdAt).toLocaleDateString("en-GB"),
          hasAnswered: item.isAnswered,
        }))
      );
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const onClickAddSelect = () => {
    console.log(selectedRowIds);
  };

  // const onClickEditQuestion = (e) => {
  //    navigate(`/edit/${selectedRowId}`);
  // };

  return (
    <>
      <Modal show={showModal} handleClose={closeModal}>
        <DeleteModalContent
          handleClose={closeModal}
          onDelete={onConfirmDelete}
        />
      </Modal>
      <div className={styles.table}>
        <div className={styles.actions}>
          <Button variant="contained" onClick={onClickAddSelect}>
            Select
          </Button>
          {/* <Button variant="contained" onClick={e=>onClickEditQuestion(e)}>
            Edit
          </Button> */}
        </div>
        <DataGrid
          loading={loading}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          baseCheckbox={RadioButtonCheckedRounded}
          slots={{ toolbar: GridToolbar }}
        />
      </div>
    </>
  );
}

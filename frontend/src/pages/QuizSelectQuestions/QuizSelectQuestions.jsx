import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import styles from "./quizSelectQuestions.module.scss";
import { Button, Checkbox, IconButton } from "@mui/material";
import {
  RadioButtonCheckedRounded,
  Delete,
  CheckBox,
  Info,
  Edit,
} from "@mui/icons-material";
import axios from "../../axios";
import { toast } from "react-toastify";
import DeleteModalContent from "../../components/Modal/DeleteModalContent/DeleteModalContent";
import Modal from "../../components/Modal/Modal";
import { useStore } from "../../store/store";
import { useLocation, Link, useNavigate, useParams } from "react-router-dom";

export default function QuizSelectQuestions(props) {
  const { data: state } = useStore();
  const { id: quizId } = useParams();
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedRowId, setSelectedRowId] = React.useState();
  const [showModal, setShowModal] = React.useState(false);
  const [activeQuestion, setActiveQuestion] = React.useState();
  const [selectedRowIds, setSelectedRowIds] = React.useState([]);
  const navigate = useNavigate();
  const [total, setTotal] = React.useState(0);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 1,
    pageSize: 5,
  });
  React.useEffect(() => {
    fetchQuestions();
  }, []);

  const onClickAddQuestion = () => {
    navigate("/add-question?quizId=" + quizId);
  };

  const onClickAddSelected = async () => {
    // console.log(selectedRowIds)
    if (!selectedRowIds.length) return;

    const loaderId = toast.loading("Adding questions...");

    const response = await axios
      .patch(`/interactive-quizs/${quizId}`, {
        questionList: selectedRowIds,
      })
      .catch((err) => {
        toast.update(loaderId, {
          render: "an error occurred",
          type: "error",
          isLoading: false,
        });
        return;
      });

    if (!response || !response.data) return;

    toast.update(loaderId, {
      render: "Questions added ...",
      type: "success",
      isLoading: false,
    });
     navigate(`/show/${quizId}`);
   // navigate(`/edit-quiz-list/${quizId}`);
  };

  const onClickEditQuestion = (id = null) => {
    navigate(`/edit-question/${id ?? selectedRowId}`);
  };
  const closeModal = () => setShowModal(false);
  const openModal = () => setShowModal(true);

  const onDeleteQuestion = (id) => {
    openModal();
    setActiveQuestion(id);
  };

  const onConfirmDelete = async () => {
    closeModal();
    try {
      await axios.delete(`/questions/${activeQuestion}`);
      toast.success("Question deleted successfully");
      await fetchQuestions();
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      field: "col0",
      headerName: "",
      width: 100,
      renderCell: (params) => (
        <Checkbox
          value={params.id}
          defaultChecked={params.row.isSelected}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRowIds((prevSelectedIds) => [
                ...prevSelectedIds,
                e.target.value,
              ]);
            } else {
              setSelectedRowIds((prevSelectedIds) =>
                prevSelectedIds.filter((x) => x !== e.target.value)
              );
            }
          }}
        />
      ),
    },
    {
      field: "name",
      headerName: "Title",
      flex: 1,
      renderCell: (params) => {
        return (
          <Link to={`/edit-question/${params.id}`}>{params.row.name}</Link>
        );
      },
    },
    {
      field: "type",
      headerName: "Type",
      width: 200,
    },
    {
      field: "complexity",
      headerName: "Complexity",
      flex: 0.8,
    },
    {
      field: "domain",
      headerName: "Domain",
      flex: 0.8,
    },
    {
      field: "subDomain",
      headerName: "Sub Domain",
      flex: 0.8,
    },
  ];

  const fetchQuiz = async () => {
    const res = await axios.get(`/interactive-quizs/${quizId}`).catch((err) => {
      toast.error("Error fetching quiz");
    });

    if (!res) toast.error("Error fetching quiz");
    return res.data;
  };

  const fetchQuestions = React.useCallback(async () => {
    const quiz = await fetchQuiz();

    if (!quiz) return;

    setLoading(true);
    const res = await axios.get(
      `/interactive-objects?page=${paginationModel.page}&limit=${paginationModel.pageSize}`
    );
    const data = res.data;
    if (!!data.docs.length) {
      setRows(
        data.docs.map((item) => ({
          ...item,
          id: item._id,
          name: item.questionName,
          type: item.type,
          domain: item.domainName,
          subDomain: item.subDomainName,
          dateModified: new Date(item.createdAt).toLocaleDateString("en-GB"),
          isSelected: !!quiz.questionList.find((q) => q._id == item._id),
        }))
      );

      setSelectedRowIds(quiz.questionList.map((q) => q._id));
    }
    setLoading(false);
    setTotal(res.data.totalDocs);
  }, [paginationModel.page, paginationModel.pageSize]);

  return (
    <>
      <Modal show={showModal} handleClose={closeModal}>
        <DeleteModalContent
          handleClose={closeModal}
          onDelete={onConfirmDelete}
        />
      </Modal>

      <div className={styles.actionsWrapper}>
        <div>
          <h3>Select Questions</h3>
        </div>
        <div className={styles.actions}>
          <Button
            variant="contained"
            onClick={onClickAddSelected}
            disabled={!selectedRowIds.length}
            style={{
              background: selectedRowIds.length > 0 ? "teal" : "gray",
            }}
          >
            Save Selected Questions
          </Button>
          <Button variant="contained" onClick={onClickAddQuestion}>
            Add new Question
          </Button>
        </div>
      </div>

      <div className={styles.table}>
        <DataGrid
          // loading={loading}
          // rows={rows}
          // columns={columns}
          // initialState={{
          //   pagination: {
          //     paginationModel: { page: 0, pageSize: 30 },
          //   },
          // }}
          // pageSizeOptions={[5, 10, 15, 20, 30]}
          // baseCheckbox={RadioButtonCheckedRounded}
          // slots={{ toolbar: GridToolbar }}
              rows={rows}
              rowCount={total}
              loading={loading}
              autoHeight
              columns={columns}
              baseCheckbox={RadioButtonCheckedRounded}
              slots={{ toolbar: GridToolbar }}
              pageSizeOptions={[5, 10]}
              paginationModel={paginationModel}
              paginationMode="server"
              onPaginationModelChange={setPaginationModel}
        />
      </div>
    </>
  );
}

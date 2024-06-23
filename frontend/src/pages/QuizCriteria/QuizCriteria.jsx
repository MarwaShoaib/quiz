import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "zustand";

import styles from "./quizCriteria.module.scss";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Clear, DesignServices } from "@mui/icons-material";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Random } from "@mongez/reinforcements";
import {
  Form,
  HiddenInput,
  requiredRule,
  useFormControl,
} from "@mongez/react-form";
import { atom } from "@mongez/react-atom";

function SelectInput({ label, data, ...props }) {
  const { error, value, changeValue, otherProps } = useFormControl({
    ...props,
    rules: [requiredRule],
  });

  return (
    <>
      {label && <InputLabel error={error}>{label}</InputLabel>}
      <Select
        style={{ width: "100%" }}
        error={error}
        value={value || "0"}
        onChange={(e) => {
          changeValue(e.target.value);
        }}
        {...otherProps}
      >
        <MenuItem value="0">{props.placeholder || "Select Value"}</MenuItem>
        {data.length > 0 &&
          data.map((item, idx) => (
            <MenuItem key={idx} value={item._id || item.id}>
              {item.title || item.name}
            </MenuItem>
          ))}
      </Select>
    </>
  );
}

function TextInput({ label, ...props }) {
  const { error, value, changeValue, otherProps } = useFormControl({
    ...props,
    rules: [requiredRule],
  });

  return (
    <>
      {label && <InputLabel error={error}>{label}</InputLabel>}
      <TextField
        style={{ width: "100%" }}
        error={error}
        value={value}
        onChange={(e) => {
          changeValue(e.target.value);
        }}
        {...otherProps}
      />
    </>
  );
}

function NumberInput({ label, ...props }) {
  const { error, value, changeValue, otherProps } = useFormControl({
    ...props,
    rules: [requiredRule],
  });

  return (
    <>
      {label && <InputLabel error={error}>{label}</InputLabel>}
      <TextField
        style={{ width: "100%" }}
        error={error}
        type="number"
        value={value}
        onChange={(e) => {
          changeValue(e.target.value);
        }}
        {...otherProps}
      />
    </>
  );
}

function generateEmptyTopic() {
  return {
    id: Random.string(),
    topicId: "",
    totalQuestions: 0,
    duration: 0,
    questionTypes: [
      {
        type: "",
        easy: undefined,
        medium: undefined,
        hard: undefined,
      },
    ],
  };
}

const criteriaAtom = atom({
  key: "criteria",
  beforeUpdate(value) {
    console.trace("WHY");
    return value;
  },
  default: {
    topics: [generateEmptyTopic()],
    selectedTopicsIds: [],
    topicsList: [],
    questionTypes: [],
  },
});

function TopicElement({ topic, index }) {
  const topicsList = criteriaAtom.use("topicsList");
  const selectedTopicsIds = criteriaAtom.use("selectedTopicsIds");
  const topicInfo = topicsList.find((t) => t._id === topic.topicId);

  const allowedTopicsToBeSelected = topicsList.filter((t) => {
    if (t._id === topic.topicId) return true;

    if (selectedTopicsIds.length === 0) return true;

    if (selectedTopicsIds.includes(t._id)) return false;

    return true;
  });

  const deleteTopic = () => {
    const { selectedTopicsIds, topics } = criteriaAtom.value;

    criteriaAtom.merge({
      topics: topics.filter((t) => t.id !== topic.id),
      selectedTopicsIds: selectedTopicsIds.filter((id) => id !== topic.topicId),
    });
  };

  const updateSelectedTopicsList = (topicId) => {
    const selectedTopicsIds = criteriaAtom.get("selectedTopicsIds");
    topic.topicId = topicId;
    criteriaAtom.change("selectedTopicsIds", [...selectedTopicsIds, topicId]);
  };

  const updateSelectedQuestionType = (question) => (questionTypeId) => {
    question.type = questionTypeId;
  };

  const updateQuestionTypeTotal = (question, type) => (value) => {
    value = Number(value);

    if (isNaN(value)) {
      value = 0;
    }

    question[type] = value;

    countTopicsTotals();
  };

  const countTopicsTotals = () => {
    for (const topic of criteriaAtom.get("topics")) {
      let totalQuestions = 0;
      let duration = 0;

      for (const question of topic.questionTypes) {
        const easy = question.easy || 0;
        const medium = question.medium || 0;
        const hard = question.hard || 0;

        totalQuestions += easy + medium + hard;
        // duration weights: easy: 1, medium: 2, hard: 3
        duration += easy + medium * 2 + hard * 3;
      }

      topic.totalQuestions = totalQuestions;
      topic.duration = duration;
    }

    criteriaAtom.change("topics", [...criteriaAtom.get("topics")]);
  };

  const addNewQuestion = () => {
    const topics = criteriaAtom.get("topics");

    const newQuestion = {
      type: "",
      id: Random.string(),
      easy: undefined,
      medium: undefined,
      hard: undefined,
    };

    topics[index].questionTypes.push(newQuestion);

    criteriaAtom.change("topics", [...topics]);
  };

  const deleteQuestion = (question) => () => {
    const topics = criteriaAtom.get("topics");

    topics[index].questionTypes = topics[index].questionTypes.filter(
      (q) => q.id !== question.id
    );

    countTopicsTotals();
  };

  return (
    <Accordion defaultExpanded={index === 0}>
      <AccordionSummary>
        {topicInfo?.title || `Topic ${index + 1}`}
      </AccordionSummary>
      <AccordionDetails>
        {index > 0 && (
          <Button variant="outlined" color="error" onClick={deleteTopic}>
            <Clear />
            <span>Delete Topic</span>
          </Button>
        )}
        <div
          style={{
            marginTop: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <div
              style={{
                width: "60%",
              }}
            >
              <SelectInput
                name={`topics.${index}.topicId`}
                label="Topic"
                placeholder="Select Topic"
                onChange={updateSelectedTopicsList}
                defaultValue={topic.topicId}
                data={allowedTopicsToBeSelected}
              />
            </div>

            <div>Total Questions: {topic.totalQuestions}</div>
            <HiddenInput
              name={`topics.${index}.totalQuestions`}
              value={topic.totalQuestions}
            />

            <div>Est Duration: {topic.duration}</div>
            <HiddenInput
              name={`topics.${index}.duration`}
              value={topic.duration}
            />
          </div>
        </div>

        <Typography variant="h4" mb={2}>
          Questions Types
        </Typography>
        {/* Questions */}
        {topic.questionTypes.map((question, idx) => (
          <div
            key={question.id || question.type || idx}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <div
              style={{
                width: "40%",
              }}
            >
              <SelectInput
                name={`topics.${index}.questionTypes.${idx}.type`}
                label="Question Type"
                placeholder="Select Question Type"
                required
                defaultValue={question.type}
                onChange={updateSelectedQuestionType(question)}
                data={criteriaAtom.get("questionTypes")}
              />
            </div>

            <div>
              <NumberInput
                name={`topics.${index}.questionTypes.${idx}.easy`}
                placeholder="Easy"
                label="Easy"
                required
                defaultValue={question.easy}
                onChange={updateQuestionTypeTotal(question, "easy")}
              />
            </div>
            <div>
              <NumberInput
                name={`topics.${index}.questionTypes.${idx}.medium`}
                placeholder="Medium"
                label="Medium"
                required
                defaultValue={question.medium}
                onChange={updateQuestionTypeTotal(question, "medium")}
              />
            </div>
            <div>
              <NumberInput
                name={`topics.${index}.questionTypes.${idx}.hard`}
                placeholder="Hard"
                label="Hard"
                required
                defaultValue={question.hard}
                onChange={updateQuestionTypeTotal(question, "hard")}
              />
            </div>
            {idx > 0 && (
              <div
                style={{
                  marginTop: "0.5rem",
                }}
              >
                <Button
                  typ="button"
                  onClick={deleteQuestion(question)}
                  variant="outlined"
                  color="error"
                >
                  <Clear />
                  <span>Delete</span>
                </Button>
              </div>
            )}
          </div>
        ))}

        <Button
          variant="contained"
          style={{
            marginTop: "0.5rem",
          }}
          color="primary"
          type="button"
          onClick={addNewQuestion}
        >
          Add Question
        </Button>
      </AccordionDetails>
    </Accordion>
  );
}

export default function QuizCriteria(props) {
  const { id: quizId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/criteria/" + quizId)
      .then((response) => {
        const criteria = response.data;

        if (criteria) {
          criteriaAtom.merge({
            topics: criteria.topics.map((topic) => ({
              id: Random.string(),
              ...topic,
              questionTypes: topic.questionTypes.map((question) => ({
                id: Random.string(),
                ...question,
              })),
            })),
            selectedTopicsIds: criteria.topics.map((topic) => topic.topicId),
          });
        }
      });
  }, [quizId]);

  const getTopics = async () => {
    const res = await axios.get(
      "http://localhost:4000/api/topics?paginate=false&quizId=" + quizId
    );

    criteriaAtom.change("topicsList", res.data);
  };

  const getAllQuestionTypes = async () => {
    const res = await axios.get(
      "http://localhost:4000/api/interactive-object-types?paginate=false"
    );

    criteriaAtom.change(
      "questionTypes",
      res.data.map((question) => ({
        // id: question._id,
        id: question.typeName,
        title: question.typeName,
      }))
    );
  };

  const onClickCancel = () => {
    navigate("/show/" + quizId);
  };

  const handleSubmit = async (options) => {
    const loaderId = toast.loading("saving..", {
      autoClose: 300,
    });
    try {
      const res = await axios
        .post(`http://localhost:4000/api/criteria/${quizId}`, options.values)
        .catch((err) =>
          toast.update(loaderId, {
            render: "an error occurred",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          })
        );

      if (!res || !res.data) {
        toast.update(loaderId, {
          render: "an error occurred",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }

      toast.update(loaderId, {
        render: "saved",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      criteriaAtom.reset();

      criteriaAtom.silentChange("topics", [generateEmptyTopic()]);

      navigate("/show/" + quizId);
    } catch {
      toast.update(loaderId, {
        render: "an error occurred",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    getTopics();
    getAllQuestionTypes();
  }, []);

  const addNewTopic = () => {
    const topics = [...criteriaAtom.get("topics"), generateEmptyTopic()];

    criteriaAtom.change("topics", topics);
  };

  const topics = criteriaAtom.use("topics");

  return (
    <>
      <div className={styles["add-question"]}>
        <div className={styles.questionType}>
          <Button
            variant="contained"
            color="info"
            type="submit"
            onClick={addNewTopic}
          >
            <span>Add Topic</span>
          </Button>
          <Button variant="outlined" color="error" onClick={onClickCancel}>
            <Clear />
            <span>cancel</span>
          </Button>
        </div>
        <Form onSubmit={handleSubmit}>
          {topics.map((topic, index) => (
            <TopicElement
              topic={topic}
              key={topic.id || topic.topicId || index}
              index={index}
            />
          ))}

          <div
            style={{
              width: "100%",
              marginTop: "2rem",
            }}
          >
            <Button
              variant="contained"
              startIcon={<DesignServices />}
              type="submit"
              fullWidth
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
}

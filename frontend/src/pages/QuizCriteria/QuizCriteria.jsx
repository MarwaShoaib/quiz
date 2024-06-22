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
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import TopicFormSection from "./TopicFormSection";
import TopicQuestionType from "./TopicQuestionType";
import {
  ActiveQuestionTypes,
  getDomainName,
  getSubDomainName,
} from "../../config";
import { Random } from "@mongez/reinforcements";
import { Form, requiredRule, useFormControl } from "@mongez/react-form";
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
    questions: [
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

      for (const question of topic.questions) {
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

    topics[index].questions.push(newQuestion);

    criteriaAtom.change("topics", [...topics]);
  };

  const deleteQuestion = (question) => () => {
    const topics = criteriaAtom.get("topics");

    topics[index].questions = topics[index].questions.filter(
      (q) => q.id !== question.id
    );

    countTopicsTotals();
  };

  return (
    <Accordion>
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

            <div>Est Duration: {topic.duration}</div>
          </div>
        </div>

        <Typography variant="h4" mb={2}>
          Questions Types
        </Typography>
        {/* Questions */}
        {topic.questions.map((question, idx) => (
          <div
            key={question.id || question.typeId || idx}
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
                name={`topics.${index}.questionTypes.${idx}.typeId`}
                label="Question Type"
                placeholder="Select Question Type"
                required
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
                onChange={updateQuestionTypeTotal(question, "easy")}
              />
            </div>
            <div>
              <NumberInput
                name={`topics.${index}.questionTypes.${idx}.medium`}
                placeholder="Medium"
                label="Medium"
                required
                onChange={updateQuestionTypeTotal(question, "medium")}
              />
            </div>
            <div>
              <NumberInput
                name={`topics.${index}.questionTypes.${idx}.hard`}
                placeholder="Hard"
                label="Hard"
                required
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
        id: question._id,
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

    const res = await axios
      .post(
        `http://localhost:4000/api/criteria/use-in-quiz/${quizId}`,
        options.values
      )
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

    navigate("/show/" + quizId);
  };

  useEffect(() => {
    getTopics();
    getAllQuestionTypes();
  }, []);

  const addNewTopic = () => {
    criteriaAtom.change("topics", [
      ...criteriaAtom.get("topics"),
      generateEmptyTopic(),
    ]);
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

function _QuizCriteria(props) {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [areas, setAreas] = useState([0]);

  const [topics, setTopics] = useState([]);

  const [showTopicForm, setShowTopicForm] = useState(false);

  const [allQuestionTypes, setAllQuestionTypes] = useState([]);

  const [questionTypes, setQuestionTypes] = useState([]);

  useEffect(() => {
    getTopics();
    getAllQuestionTypes();
  }, []);

  const onSubmit = async (values) => {
    // if a topic was added
    // then get it`s data before saving

    const len = values.areas.length;
    for (let i = 0; i < len; i++) {
      const area = values.areas[i];

      if (!area) continue;

      if (area?.topic) {
        values.areas[i].topic = {
          ...area.topic,
          domainName: getDomainName(area.topic.domainId),
          subDomainName: getSubDomainName(
            area.topic.domainId,
            area.topic.subDomainId
          ),
        };
      }

      values.areas[i].selectedQuestions =
        document.querySelector(`[name="areas[${i}].selectedQuestions"]`)
          ?.value ?? "";
    }

    // console.log(values);

    // return;

    const loaderId = toast.loading("saving..", {
      autoClose: 300,
    });

    const res = await axios
      .post(`http://localhost:4000/api/criteria/use-in-quiz/${quizId}`, values)
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

    // console.log(res.data);

    toast.update(loaderId, {
      render: "saved",
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });
    navigate("/show/" + quizId);
  };

  const onClickCancel = () => {
    navigate("/show/" + quizId);
  };

  const getTopics = async () => {
    const res = await axios.get(
      "http://localhost:4000/api/topics?paginate=false&quizId=" + quizId
    );
    setTopics(res.data);
  };

  const getAllQuestionTypes = async () => {
    const res = await axios.get(
      "http://localhost:4000/api/interactive-object-types?paginate=false"
    );
    console.log(res.data);
    setAllQuestionTypes(res.data);
  };

  function onSelectTopic(e) {
    if (e.target.value === "new") {
      setShowTopicForm(true);
    } else {
      setShowTopicForm(false);
    }
  }

  return (
    <>
      <div className={styles["add-question"]}>
        <div className={styles.questionType}>
          <Button
            variant="contained"
            color="info"
            type="submit"
            onClick={() => setAreas([...areas, areas.length])}
          >
            <span>Add Topic</span>
          </Button>

          <Button variant="outlined" color="error" onClick={onClickCancel}>
            <Clear />
            <span>cancel</span>
          </Button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {areas.map((area, index) => (
            <fieldset key={area} style={{ margin: "1rem 0" }}>
              <legend>Add Questions Based On Criteria ({area + 1})</legend>
              <div className={styles.flexRow}>
                <div style={{ width: "50%" }}>
                  <Select
                    style={{ width: "100%" }}
                    label="topic"
                    name="topicId"
                    {...register(`areas[${area}].topicId`)}
                    placeholder="select topic"
                    errors={errors}
                    defaultValue={0}
                    onChange={onSelectTopic}
                  >
                    <MenuItem value="0">Select Topic</MenuItem>
                    {topics.length > 0 &&
                      topics.map((topic, idx) => (
                        <MenuItem key={topic._id} value={topic._id}>
                          {topic.title}
                        </MenuItem>
                      ))}
                    <MenuItem value="new">
                      <Button
                        size="xs"
                        style={{
                          textAlign: "center",
                          width: "100%",
                        }}
                        color="warning"
                      >
                        Add New Topic
                      </Button>
                    </MenuItem>
                  </Select>
                </div>

                <div style={{ width: "20%" }}>
                  <TextField
                    style={{ width: "100%" }}
                    label="Number of Questions"
                    name="numberOfQuestions"
                    type="number"
                    {...register(`areas[${area}].numberOfQuestions`)}
                    errors={errors}
                  />
                </div>
                <div style={{ width: "25%" }}>
                  <TextField
                    style={{ width: "100%" }}
                    label="Duration"
                    name="duration"
                    type="number"
                    {...register(`areas[${area}].duration`)}
                    errors={errors}
                  />
                </div>
              </div>

              {showTopicForm && (
                <TopicFormSection register={register} area={area} />
              )}

              {questionTypes.length > 0 &&
                questionTypes.map((qt, idx) => (
                  <TopicQuestionType
                    register={register}
                    area={area}
                    allQuestionTypes={allQuestionTypes}
                    // questionType={qt}
                    index={idx}
                    key={area}
                  />
                ))}

              {questionTypes.length < ActiveQuestionTypes.length && (
                <Button
                  variant="contained"
                  type="button"
                  onClick={() => setQuestionTypes([...questionTypes, {}])}
                >
                  Add Question Type
                </Button>
              )}
            </fieldset>
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
        </form>
      </div>
    </>
  );
}

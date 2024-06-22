import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "zustand";

import styles from "./quizCriteria.module.scss";
import {
  Button,
  FormControl,
  Input,
  MenuItem,
  Select,
  TextField,
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

export default function QuizCriteria(props) {
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
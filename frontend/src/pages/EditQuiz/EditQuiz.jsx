import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import { Button } from "@mui/material";
import Modal from "../../components/Modal/Modal";
import DeleteModalContent from "../../components/Modal/DeleteModalContent/DeleteModalContent";
import axios from "../../axios";
import { toast } from "react-toastify";
import {
    ownerList,
    comlixetyList,
    domainList,
    languageList,
    subDomainList,
    getDomainName,
    getSubDomainName,
 } from "../../config";

import styles from "./editQuiz.module.scss";



const EditQuiz = () => {

  const [showModal, setShowModal] = React.useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: async () => fetchData(),
  });
  

  const fetchData = async () => {
    const res = await axios.get(`/interactive-quizs/${id}`).catch(err => {
      if (err.response.status === 404) {
        navigate("/");
        toast.error("Quiz not found");
        return;
      }
    });

    if (!res || !res.data) return null;

    console.log(res.data);
    return {
      ...res.data,
     
    };
  };

  React.useEffect(() => {
    
  }, []);

  

  
  const closeModal = () => setShowModal(false);
  const openModal = () => setShowModal(true);

  const onConfirmDelete = async () => {
    closeModal();
    try {
      await axios.delete(`/interactive-quizs/${id}`);
      toast.success("Quiz deleted successfully");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };
  

  const onClickDelete = () => {
    openModal();
  };

  const onClickCancel = () => {
    navigate("/");
  };

  const onClickEdit = () => {
    navigate(`/edit-quiz-list/${id}`);
  };

  const onSubmit = async (values) => {
    try {
      const res = await axios.patch(`/interactive-quizs/${id}`, {
        ...values,
        domainName: getDomainName(values.domainId),
        subDomainName: getSubDomainName(values.domainId, values.subDomainId),
      });
      toast.success("Question updated successfully!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      
      <Modal show={showModal} handleClose={closeModal}>
        <DeleteModalContent
          handleClose={closeModal}
          onDelete={onConfirmDelete}
        />
      </Modal>
      <div className={styles["edit-object"]}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <legend>Edit Quiz </legend>
            <div>
            <Input
              label="title"
              name="quizName"
              type="text"
              register={register}
              errors={errors}
            />
            <div className={styles.row}>
              <Select
                label="object owner"
                name="objectOwner"
                register={register}
                errors={errors}
              >
                {ownerList.map((item, idx) => (
                  <option key={idx} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
              <Select
                label="domain"
                name="domainId"
                register={register}
                errors={errors}
              >
                {domainList?.map((domain, idx) => (
                  <option key={domain.id} value={domain.id}>
                    {domain.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className={styles.row}>
              <Select
                label="sub domain"
                name="subDomainId"
                register={register}
                errors={errors}
              >
                {subDomainList?.[watch().domainId]?.map((subDomain, idx) => (
                  <option key={subDomain.id} value={subDomain.id}>
                    {subDomain.name}
                  </option>
                ))}
              </Select>
              <Input
                label="Total grade"
                name="totalGrade"
                register={register}
                errors={errors}
              />
              <Input
                label="The pass score"
                name="ThePassScore"
                register={register}
                errors={errors}
              />
            </div>
            <div className={styles.row}>
            <Input
                label="Quiz schedule"
                name="quizSchedule"
                type="datetime-local"
                value="2024-06-01T09:00"
                register={register}
                errors={errors}
              />
              <Input
                label="Quiz Duration"
                name="quizDuration"
                type="time"
                value="09:00"
                register={register}
                errors={errors}
              />
            </div>
            <div className={styles.row}>
              <Select
                label="language"
                name="language"
                register={register}
                errors={errors}
              >
                {languageList.map((item, idx) => (
                  <option key={idx} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </Select>
              <Select
                label="complexity"
                name="complexity"
                register={register}
                errors={errors}
              >
                {comlixetyList.map((item, idx) => (
                  <option key={idx} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </div>

              <div className={styles.actions}>
                <Button variant="contained" type="submit">
                  Save
                </Button>
                <Button variant="contained" onClick={onClickEdit}>
                  Add Question
                </Button>
                <Button variant="contained" onClick={onClickDelete}>
                  Delete
                </Button>
                <Button variant="contained" onClick={onClickCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    </>
  );
};

export default EditQuiz;

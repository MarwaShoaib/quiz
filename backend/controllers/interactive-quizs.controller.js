require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
let router = express.Router();
let mongoose = require("mongoose");
let interactiveQuizSchema =
  require("../models/interactive-quiz.model").interactiveQuizSchema;
let InteractiveObjectTypeSchema =
  require("../models/object-types.model").InteractiveObjectTypeSchema;
const fs = require("fs");
const path = require("path");
const request = require("request");
const isNotValidObjectId = require("../utils/helpers");
const {
  interactiveObjectSchema,
} = require("../models/interactive-object.model");
const { TopicSchema } = require("../models/tobic.model");
const { CriteriaSchema } = require("../models/criteria.model");
const TopicsSchema = require("../models/tobic.model").TopicSchema;
const dataArray = [];

/**
 *@swagger
 *
 *info:
 *  version: 2.0.0
 *  title: Interactive Object APIs .
 * schemes:
 *   - http
 * host: localhost:4000
 * basePath: /api
 *
 *paths:
 *  /interactive-objects:
 *    get:
 *      tags:
 *        - interactive-objects
 *      parameters:
 *        - name: page
 *          in: query
 *          example: 1
 *        - name: limit
 *          in: query
 *          example: 10
 *        - name: objectName
 *          in: query
 *          type: string
 *        - name: domainId
 *          in: query
 *          type: string
 *        - name: domainName
 *          in: query
 *          type: string
 *        - name: subDomainId
 *          in: query
 *          type: string
 *        - name: subDomainName
 *          in: query
 *          type: string
 *        - name: language
 *          in: query
 *          type: string
 *        - name: isAnswered
 *          in: query
 *          type: string
 *          enum:
 *            - r
 *            - y
 *            - g
 *        - name: type
 *          in: query
 *          type: string
 *        - name: objectOrExplanation
 *          in: query
 *          type: string
 *          enum:
 *            - Q
 *            - X
 *      responses:
 *        200:
 *          description: List of interactive-objects
 *          schema:
 *            type: array
 *            items:
 *              $ref: "#/definitions/GetObject"
 *
 *    post:
 *      tags:
 *        - interactive-objects
 *      description: Add new object.
 *      parameters:
 *        - name: object
 *          in: body
 *          required: true
 *          schema:
 *            $ref: "#/definitions/PostObject"
 *      responses:
 *        200:
 *          description: learning object created successfully.
 *        406:
 *          description: Not Acceptable.
 *
 *  /interactive-objects/{id}:
 *    get:
 *      tags:
 *        - interactive-objects
 *      description: Get object by ID.
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          type: string
 *      responses:
 *        200:
 *          description: Required object data.
 *          schema:
 *            $ref: "#/definitions/GetObject"
 *        404:
 *          description: Can't find object with the given ID
 *
 *    patch:
 *      tags:
 *        - interactive-objects
 *      description: update object.
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          type: string
 *        - name: object
 *          in: body
 *          required: true
 *          schema:
 *            $ref: "#/definitions/PostObject"
 *      responses:
 *        200:
 *          description: Object updated successfully.
 *          schema:
 *            $ref: "#/definitions/GetObject"
 *        404:
 *          description: Can't find object with the given ID.
 *
 *    delete:
 *      tags:
 *        - interactive-objects
 *      description: Delete object.
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          type: string
 *      responses:
 *        200:
 *          description: Object deleted successfully.
 *        404:
 *          description: Can't find object with the given ID.
 *
 * definitions:
 *   GetObject:
 *     properties:
 *       _id:
 *         type: string
 *         example: 5df780cc50b2d42fd00dc872
 *       questionName:
 *         type: string
 *         example: What is ionic bond?
 *       language:
 *         type: string
 *         example: en
 *         enum:
 *           - en
 *           - ar
 *           - fr
 *           - it
 *           - es
 *           - de
 *       domainId:
 *         type: string
 *         example: 5df780cc50b2d42fd00dc872
 *       domainName:
 *         type: string
 *         example: Science
 *       subDomainId:
 *         type: string
 *         example: 5df780cc50b2d42fd00dc872
 *       subDomainName:
 *         type: string
 *         example: Ionic Bonds
 *       isAnswered:
 *         type: string
 *         enum:
 *           - r
 *           - y
 *           - g
 *       parameters:
 *         type: object
 *       type:
 *         type: string
 *         example: MCQ
 *       objectOrExplanation:
 *          type: string
 *          enum:
 *            - Q
 *            - X
 *       createdAt:
 *         type: string
 *         format: date
 *         example: 2023-12-10T10:21:28.729Z
 *       updatedAt:
 *         type: string
 *         format: date
 *         example: 2023-12-10T10:21:28.729Z
 *   PostObject:
 *     required:
 *       - questionName
 *       - language
 *     properties:
 *       questionName:
 *         type: string
 *         example: What is ionic bond?
 *       language:
 *         type: string
 *         example: en
 *         enum:
 *           - en
 *           - ar
 *           - fr
 *           - it
 *           - es
 *           - de
 *       domainId:
 *         type: string
 *         example: 5df780cc50b2d42fd00dc872
 *       domainName:
 *         type: string
 *         example: Science
 *       subDomainId:
 *         type: string
 *         example: 5df780cc50b2d42fd00dc872
 *       subDomainName:
 *         type: string
 *         example: Ionic Bonds
 *       isAnswered:
 *         type: string
 *         enum:
 *           - r
 *           - y
 *           - g
 *       parameters:
 *         type: object
 *       type:
 *         type: string
 *         example: MCQ
 *       objectOrExplanation:
 *          type: string
 *          enum:
 *            - Q
 *            - X
 */

router.get("/interactive-quizs", async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 250;

  delete req.query.page;
  delete req.query.limit;
  for await (let item of ["object", "domainName", "subDomainName"])
    if (req.query[item]) {
      const searchValue = req.query[item];
      req.query[item] = {
        $regex: new RegExp(searchValue),
        $options: "i",
      };
    }
  const data = await interactiveQuizSchema.paginate(req.query, {
    page,
    limit,
    sort: { updatedAt: "desc" },
  });
  return res.json(data);
});

router.post("/interactive-quizs", async (req, res) => {
  const {
    quizName,
    language,
    domainId,
    subDomainId,
    domainName,
    subDomainName,
    quizSchedule,
    quizDuration,
    totalGrade,
    ThePassScore,
    complexity,
    questionList,
  } = req.body;
  const newObj = await new interactiveQuizSchema({
    quizName,
    language,
    domainId,
    subDomainId,
    domainName,
    subDomainName,
    quizSchedule,
    quizDuration,
    totalGrade,
    ThePassScore,
    complexity,
    questionList,
  }).save();
  if (newObj) res.json(newObj);
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

router.post("/postID_Quize/:id", async (req, res) => {
  const questionsArray = req.body.questionsArray;
  let obj = await interactiveQuizSchema.findById(req.params.id);
  obj.questionList.push(...questionsArray);
  await obj.save();
  res.send("Data send successfully");
});
router.get("/postID_Quize", async (req, res) => {
  res.json(dataArray);
});

router.get("questions", (req, res) => {
  const questions = [
    "Question 1?",
    "Question 2?",
    "Question 3?",
    // Add more questions
  ];
  res.json(questions);
});

router.post("submit", (req, res) => {
  const answers = req.body.answers;
  // Score the answers and send back the result
  // For simplicity, let's just log the answers here
  console.log("Submitted answers:", answers);
  res.send("Quiz submitted successfully!");
});
router.get("/interactive-quizs/:id", async (req, res) => {
  if (isNotValidObjectId(req.params.id))
    return res.status(404).json("Invalid ID");

  let obj = await interactiveQuizSchema
    .findById(req.params.id)
    .populate(["questionList", "criterias"]);
  res.status(200).json(obj);
});

const getQuestionsByCriteria = async (criteria) => {
  if (!criteria || !Array.isArray(criteria)) return [];

  const queries = criteria?.map(async (criterion) => {
    const { topicId, type, easy, medium, hard } = criterion;

    /**
     * Use the topicId to find the tobic object and fetch (domainId, subDomainId) from it
     */

    const topic = TopicsSchema.findById(topicId);

    const easyQuestions = await interactiveObjectSchema
      .find({
        type,
        complexity: "easy",
        domainId: topic.domainId,
        subDomainId: topic.subDomainId,
      }) // domainId, subDomainId
      .limit(easy);
    const mediumQuestions = await interactiveObjectSchema
      .find({
        type,
        complexity: "medium",
        domainId: topic.domainId,
        subDomainId: topic.subDomainId,
      }) // domainId, subDomainId
      .limit(medium);
    const hardQuestions = await interactiveObjectSchema
      .find({
        type,
        complexity: "hard",
        domainId: topic.domainId,
        subDomainId: topic.subDomainId,
      }) // domainId, subDomainId
      .limit(hard);

    return [...easyQuestions, ...mediumQuestions, ...hardQuestions];
  });
  const results = await Promise.all(queries);
  return results.flat();
};

router.get("/questionInQuize/:id", async (req, res) => {
  if (isNotValidObjectId(req.params.id))
    return res.status(404).json("Invalid ID");

  let obj = await interactiveQuizSchema.findById(req.params.id);

  if (!obj) return res.status(200).json([]);

  const baseFilter = {
    isAnswered: "g", // g for green means has answer
    language: obj.language,
  };

  // manual questions
  let questionList = await interactiveObjectSchema.find({
    _id: { $in: obj.questionList },
    ...baseFilter,
    subDomainId: obj.subDomainId,
  });

  /** check if quiz uses auto generated questions */
  if (obj.isAutoGenerated && obj.criteria) {
    const criteria = await CriteriaSchema.findById(obj.criteria);
    const criteriaQuestions = [];

    if (criteria) {
      const topics = criteria.topics;

      for (const topic of topics) {
        const { topicId, questionTypes } = topic;

        for (const questionType of questionTypes) {
          const { type, easy, medium, hard } = questionType;

          if (easy) {
            // now we need to fetch the questions based on the criteria
            const easyQuestions = await interactiveObjectSchema.find({
              topicId,
              complexity: "easy",
              type,
              ...baseFilter,
            });

            criteriaQuestions.push(
              ...shuffleArray(easyQuestions).slice(0, Number(easy))
            );
          }

          if (medium) {
            // now we need to fetch the questions based on the criteria
            const mediumQuestions = await interactiveObjectSchema.find({
              topicId,
              complexity: "medium",
              type,
              ...baseFilter,
            });

            criteriaQuestions.push(
              ...shuffleArray(mediumQuestions).slice(0, Number(medium))
            );
          }

          if (hard) {
            // now we need to fetch the questions based on the criteria
            const hardQuestions = await interactiveObjectSchema.find({
              topicId,
              complexity: "hard",
              type,
              ...baseFilter,
            });

            criteriaQuestions.push(
              ...shuffleArray(hardQuestions).slice(0, Number(hard))
            );
          }
        }
      }
    }

    const finalQuestions = criteriaQuestions;

    const questionsIds = questionList.map((q) => q._id);

    for (const question of finalQuestions) {
      if (questionsIds.includes(question._id)) continue;

      questionList.push(question);
    }
  }

  // if you want to shuffle all questions then uncomment the following line
  questionList = shuffleArray(questionList);

  if (req.query.domain && req.query.domain.length > 4) {
    questionList = questionList.filter((q) => q.domainId == req.query.domain);
  }
  if (req.query.subDomain && req.query.subDomain !== "") {
    questionList = questionList.filter(
      (q) => q.subDomainId == req.query.subDomain
    );
  }
  if (req.query.language && req.query.language !== "") {
    questionList = questionList.filter((q) => q.language == req.query.language);
  }
  if (req.query.answerStatus && req.query.answerStatus !== "") {
    questionList = questionList.filter(
      (q) => q.hasAnswered == req.query.answerStatus
    );
  }

  res.status(200).json(questionList);
});
router.delete(
  "/removeQuestionFromQuiz/:quizId/:questionId",
  async (req, res) => {
    if (isNotValidObjectId(req.params.quizId))
      return res.status(404).json("Invalid ID");

    let quiz = await interactiveQuizSchema
      .findById(req.params.quizId)
      .populate("questionList");

    if (!quiz) return res.status(404).json("Invalid ID");

    let questionList = quiz.questionList;

    questionList = questionList.filter((q) => q._id != req.params.questionId);

    quiz.questionList = questionList;

    const obj = { _id: req.params.quizId, ...quiz };
    obj.updatedAt = Date.now();

    interactiveQuizSchema.updateOne(
      { _id: req.params.quizId },
      {
        $set: obj,
      },
      {
        new: false,
        runValidators: true,
        returnNewDocument: true,
        upsert: true,
      },
      (err, doc) => {
        if (!err) {
          res.status(200).json({ success: true });
        } else {
          res.status(500).json(err);
        }
      }
    );
  }
);
router.patch("/interactive-quizs/:id", (req, res) => {
  const id = req.params.id;
  const obj = { _id: id };
  for (let key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      if (key === "questionList" && typeof req.body[key] === "string") {
        obj[key] = JSON.parse(req.body[key]);
      } else {
        obj[key] = req.body[key];
      }

      obj.isAutoGenerated = false;
    }
  }

  obj.updatedAt = Date.now();
  interactiveQuizSchema.updateOne(
    { _id: id },
    {
      $set: obj,
    },
    {
      new: false,
      runValidators: true,
      returnNewDocument: true,
      upsert: true,
    },
    (err, doc) => {
      if (!err) {
        res.status(200).json(obj);
      } else {
        res.status(500).json(err);
      }
    }
  );
});
router.delete("/interactive-quizs/:id", async (req, res) => {
  interactiveQuizSchema
    .findByIdAndRemove(req.params.id)
    .then((doc) => {
      res.status(200).json("Object deleted successfully.");
    })
    .catch((err) => {
      res.status(500).json(`Can't delete object: ${err}`);
    });
});

module.exports = router;

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
let router = express.Router();
let mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const request = require("request");
const isNotValidObjectId = require("../utils/helpers");
const { InteractiveObjectTypeSchema } = require("../models/object-types.model");
const { interactiveQuizSchema } = require("../models/interactive-quiz.model");
const {
  interactiveObjectSchema,
} = require("../models/interactive-object.model");
const interactiveObjectModel = require("../models/interactive-object.model");
const TopicSchema = require("../models/tobic.model").TopicSchema;
const dataArray = [];

router.get("/topics", async (req, res) => {
  const query = req.query;

  const page = query.page || 1;
  const limit = query.limit || 14;
  const paginate = query.paginate || "";
  const quizId = query.quizId || "";

  delete query.page;
  delete query.limit;
  delete query.paginate;
  delete query.quizId;

  if (quizId) {
    const subDomainId = await interactiveQuizSchema.findById(quizId);

    query["subDomainId"] = subDomainId?.subDomainId;
  }

  if (query["subDomainName"]) {
    const searchValue = query["subDomainName"];
    query["subDomainName"] = {
      $regex: new RegExp(searchValue),
      $options: "i",
    };
  }

  if (paginate === "false") {
    return res.json(await TopicSchema.find(query));
  }

  const topics = await TopicSchema.paginate(query, {
    page,
    limit,
    sort: { updatedAt: "desc" },
  });

  const topicsWithQuestionCount = await Promise.all(
    topics.docs.map(async (topic) => {
      const questionCount = await interactiveObjectSchema.countDocuments({
        topicId: topic._id,
      });
      return { ...topic.toObject(), questionCount };
    })
  );

  return res.json({
    ...topics,
    docs: topicsWithQuestionCount,
  });
});

router.post("/topics", async (req, res) => {
  const { title, domainId, domainName, subDomainId, subDomainName } = req.body;

  const topic = await new TopicSchema({
    title,
    domainId,
    domainName,
    subDomainId,
    subDomainName,
  }).save();
  if (topic) res.json(topic);
});

router.get("/topics/:id", async (req, res) => {
  if (isNotValidObjectId(req.params.id))
    return res.status(404).json("Invalid ID");

  const topic = await TopicSchema.findById(req.params.id);
  return res.status(200).json(topic);
});

router.put("/topics/:id", async (req, res) => {
  if (isNotValidObjectId(req.params.id))
    return res.status(404).json("Invalid ID");

  const obj = { _id: req.params.id };
  for (let key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      obj[key] = req.body[key];
    }
  }
  obj.updatedAt = Date.now();

  TopicSchema.updateOne(
    { _id: req.params.id },
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

router.delete("/topics/:id", async (req, res) => {
  if (isNotValidObjectId(req.params.id))
    return res.status(404).json("Invalid ID");

  try {
    const deletedTopic = await TopicSchema.findByIdAndDelete(req.params.id);
    if (!deletedTopic) {
      res.status(404).send("topic not found");
    }
    res.status(200).send(deletedTopic);
  } catch (error) {
    res.status(400).send("Error deleting topic:");
  }
});

router.post("/topics-criteria/:quizId", async (req, res) => {
  if (isNotValidObjectId(req.params.quizId))
    return res.status(404).json("Invalid ID");

  // check if topic object was passed to request
  let topic = null;
  let questions = [];

  if (req.body.topicId === "new" && req.body.topic) {
    // THEN we create the topic first
    const { title, domainId, domainName, subDomainId, subDomainName } =
      req.body.topic;

    topic = await new TopicSchema({
      title,
      domainId,
      domainName,
      subDomainId,
      subDomainName,
    }).save();

    // Then we add the questions to current topic
    const selectedQuestionsIds = req.body.selectedQuestions.split(",");
    // Convert string IDs to ObjectId if necessary
    const objectIds = selectedQuestionsIds.map((id) =>
      mongoose.Types.ObjectId(id)
    );
    interactiveObjectSchema.find({ _id: { $in: objectIds } }).then((docs) => {
      questions = docs;
    });
  }

  const topicId = req.body.topicId === "new" ? topic.id : req.body.topicId;

  if (!questions) {
    questions = await interactiveObjectSchema.find({
      topicId: topicId,
    });
  }

  const body = {
    topicId: req.body.topicId,
    numberOfQuestions: Number(req.body.numberOfQuestions),
    duration: Number(req.body.duration),

    // easyPercentage: Number(req.body.easyPercentage),
    // mediumPercentage: Number(req.body.mediumPercentage),
    // hardPercentage: Number(req.body.hardPercentage),

    // mcqPercentage: Number(req.body.mcqPercentage),
    // fillTheBlankPercentage: Number(req.body.fillTheBlankPercentage),
    // trueFalsePercentage: Number(req.body.trueFalsePercentage),
  };

  const totalQuestions =
    body.numberOfQuestions > questions.length
      ? questions.length
      : body.numberOfQuestions;

  const criteria = req.body.questionTypes;
  const getQuestionsByCriteria = async (criteria) => {
    const queries = criteria.map(async (criterion) => {
      const { type, easy, medium, hard } = criterion;

      // Get the total count of questions for the current type
      const totalQuestions = await interactiveObjectSchema.countDocuments({
        type,
      });

      // Calculate the number of questions based on percentages
      const easyCount = Math.floor((easy / 100) * totalQuestions);
      const mediumCount = Math.floor((medium / 100) * totalQuestions);
      const hardCount = Math.floor((hard / 100) * totalQuestions);

      // Fetch questions based on calculated counts
      const easyQuestions = await interactiveObjectSchema
        .find({ type, complexity: "easy" })
        .limit(easyCount);
      const mediumQuestions = await interactiveObjectSchema
        .find({ type, complexity: "medium" })
        .limit(mediumCount);
      const hardQuestions = await interactiveObjectSchema
        .find({ type, complexity: "hard" })
        .limit(hardCount);

      return [...easyQuestions, ...mediumQuestions, ...hardQuestions];
    });
    const results = await Promise.all(queries);
    return results.flat();
  };

  const selectedQuestions = await getQuestionsByCriteria(criteria);

  /**
   * Last update quiz with new list
   */
  const id = req.params.quizId;
  const obj = { _id: id };

  obj["questionList"] = selectedQuestions.map((x) => x._id);

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

module.exports = router;
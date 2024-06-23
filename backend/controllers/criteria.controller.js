require("dotenv").config();
const express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
const isNotValidObjectId = require("../utils/helpers");
const TopicSchema = require("../models/tobic.model").TopicSchema;
const { interactiveQuizSchema } = require("../models/interactive-quiz.model");
const {
  interactiveObjectSchema,
} = require("../models/interactive-object.model");
const { CriteriaSchema } = require("../models/criteria.model");

router.get("/criteria/:quizId", async (req, res) => {
  if (isNotValidObjectId(req.params.quizId))
    return res.status(404).json("Invalid ID");

  const criteria = await CriteriaSchema.findOne({ quizId: req.params.quizId });

  return res.json(criteria);
});

router.post("/criteria/:quizId", async (req, res) => {
  if (isNotValidObjectId(req.params.quizId))
    return res.status(404).json("Invalid ID");

  const topics = req.body.topics;

  const criteria = await CriteriaSchema.findOne({ quizId: req.params.quizId });

  if (criteria) {
    console.log("Found Criteria, Updating");
    // we now need to update the topics in that criteria
    criteria.topics = topics;

    await criteria.save();

    res.json(criteria);

    const quiz = await interactiveQuizSchema.findById(req.params.quizId);

    quiz.criteria = criteria._id;
    quiz.isAutoGenerated = true;

    await quiz.save();

    return;
  }

  const newCriteria = new CriteriaSchema({
    quizId: req.params.quizId,
    topics,
  });

  await newCriteria.save();

  res.json(newCriteria);

  const quiz = await interactiveQuizSchema.findById(req.params.quizId);

  quiz.criteria = newCriteria._id;
  quiz.isAutoGenerated = true;
  await quiz.save();
});
router.post("/criteria/use-in-quiz/:quizId", async (req, res) => {
  if (isNotValidObjectId(req.params.quizId))
    return res.status(404).json("Invalid ID");

  /**  firstly create the criterias */
  const criterias = [];
  for (const area of req.body.areas) {
    if (area.topicId === "new") {
      // then create a new topic
      const { title, domainId, domainName, subDomainId, subDomainName } =
        area.topic;

      topic = await new TopicSchema({
        title,
        domainId,
        domainName,
        subDomainId,
        subDomainName,
      }).save();

      area.topicId = topic.id;

      // Then we add the questions to current topic
      const selectedQuestionsIds = area.selectedQuestions.split(",");
      // Convert string IDs to ObjectId if necessary
      const objectIds = selectedQuestionsIds.map((id) =>
        mongoose.Types.ObjectId(id)
      );
      interactiveObjectSchema
        .find({ _id: { $in: objectIds } })
        .then(async (docs) => {
          for (const q of docs) {
            const question = await interactiveObjectSchema.findById(q._id);

            if (!question) continue;

            question.topicId = topic._id;
            question.topicTitle = topic.title;
            await question.save();
          }
        });
    }

    criteria = await new CriteriaSchema({
      ...area,
    }).save();

    criterias.push(criteria);
  }

  /** secondly add the criterias to the quiz */
  let obj = await interactiveQuizSchema.findById(req.params.quizId);
  obj.criterias = criterias.map((x) => x._id);
  obj.isAutoGenerated = true;
  await obj.save();

  return res.json(obj);
});

module.exports = router;

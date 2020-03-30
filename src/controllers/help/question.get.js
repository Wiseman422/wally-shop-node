const router = require('express').Router();
const errors = require('../../errors');
const {HelpQuestion} = require('../../schemas');
/**
 *  @swagger
 *  /api/help/question/{question_id}:
 *    get:
 *      tags:
 *        - help
 *      description: get help question for the question ID
 *      parameters:
 *        - name: question_id
 *          default: all
 *          description: get the help question
 *          in: path
 *          type: string
 *          required: true
 *      responses:
 *        200:
 *          description: help question
 */

router.get('/api/help/question/:question_id',
    errors.wrap(async (req, res) => {
        const questionId = req.params.question_id;
        const question = await HelpQuestion.findById(questionId);
        question.number_views += 1;

        await question.save();

        res.json(question);
    })
);

module.exports = router;

const router = require('express').Router();
const errors = require('../../../errors');
const {HelpQuestion} = require('../../../schemas');
const userRights = require('../../../enums/user-roles');
const authenticate = require('../../../middleware/authenticate');
const arrangeInput = require('../../../middleware/arrange-inputs');

/**
 *  @swagger
 *  /api/admin/questions:
 *    post:
 *      tags:
 *        - question
 *      description: create question, Admin API
 *      parameters:
 *      responses:
 *        200:
 *          description: questions
 */

router.post('/api/admin/help/questions',
    // TODO uncomment to activate admin-only access
    //authenticate([userRights.ADMIN]),
    errors.wrap(async (req, res) => {
        const topic_ids = req.body.topic_ids;
        const question_texts = req.body.question_texts;
        const answer_texts = req.body.answer_texts;
        const read_mores = req.body.read_mores;

        const questions = [];
        const qIds = [];

        for (var i = topic_ids.length - 1; i >= 0; i--) {
            console.log(i);
            var qObj = {
                topic_id: topic_ids[i],
                question_text: question_texts[i],
                answer_text: answer_texts[i],
                read_more: read_mores[i],
            };

            const question = await HelpQuestion.create(qObj);
            questions.push(question);
            qIds.push(question.id);
        };
        console.log(qIds);
        res.json(questions);
    })
);

module.exports = router;


const router = require('express').Router();
const errors = require('../../../errors');
const {HelpQuestion} = require('../../../schemas');

/**
 *  @swagger
 *  /api/admin/help/topic:
 *    post:
 *      tags:
 *        - admin/help
 *      description: Creates a help topic
 *      responses:
 *        200:
 *          description: created help topic
 */

router.post('/api/admin/help/question',
    errors.wrap(async (req, res) => {
        let helpQuestion = new HelpQuestion({
          topic_id: req.body.topic_id,
          question_text: req.body.question_text,
          read_more: req.body.read_more,
          answer_text: req.body.answer_text});
        
        await helpQuestion.save();

        res.json(helpQuestion);
    })
);

module.exports = router;
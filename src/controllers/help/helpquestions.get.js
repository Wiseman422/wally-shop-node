const router = require('express').Router();
const errors = require('../../errors');
const {HelpQuestion} = require('../../schemas');
/**
 *  @swagger
 *  /api/help/questions/{topic_id}:
 *    get:
 *      tags:
 *        - help
 *      description: get help questions for given topic / 'all'
 *      parameters:
 *        - name: topic_id
 *          default: all
 *          description: help questions
 *          in: path
 *          type: string
 *          required: true
 *      responses:
 *        200:
 *          description: array of help questions
 */

router.get(['/api/help/questions/:topic_id'],
    errors.wrap(async (req, res) => {
        const topicId = req.params.topic_id;
        var questions = [];

        if (topicId == 'all') {
            questions = await HelpQuestion.find()
                .sort('-number_views');
        }
        
        else if (topicId) {
            questions = await HelpQuestion.find({topic_id: topicId})
                .sort('-number_views');
        }

        res.json(questions);
    })
);

module.exports = router;

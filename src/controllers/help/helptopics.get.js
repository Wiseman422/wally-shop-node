const router = require('express').Router();
const errors = require('../../errors');
const {HelpTopic} = require('../../schemas');
/**
 *  @swagger
 *  /api/help/topics:
 *    get:
 *      tags:
 *        - help
 *      description: get all the help topics
 *      parameters:
 *      responses:
 *        200:
 *          description: array of help topics
 */

router.get('/api/help/topics',
    errors.wrap(async (req, res) => {
        const topics = await HelpTopic.find()
            .sort('name');

        res.json(topics);
    })
);

module.exports = router;

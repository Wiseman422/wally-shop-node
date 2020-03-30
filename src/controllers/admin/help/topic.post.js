const router = require('express').Router();
const errors = require('../../../errors');
const {HelpTopic} = require('../../../schemas');

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

router.post('/api/admin/help/topic',
    errors.wrap(async (req, res) => {
        let helpTopic = new HelpTopic({name: req.body.name});
        
        await helpTopic.save();

        res.json(helpTopic);
    })
);

module.exports = router;
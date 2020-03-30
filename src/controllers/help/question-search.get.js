const router = require('express').Router();
const errors = require('../../errors');
const {HelpQuestion} = require('../../schemas');
/**
 *  @swagger
 *  /api/help/search?keyword=[search term]:
 *    get:
 *      tags:
 *        - help
 *      description: search help questions for the search term
 *      parameters:
 *        - name: keyword
 *          default: 
 *          description: searches HelpQuestion questions and answers for the given search term
 *          in: path
 *          type: string
 *          required: true
 *      responses:
 *        200:
 *          description: array of help questions
 */

router.get('/api/help/search',
    errors.wrap(async (req, res) => {
        const searchTerm = req.query.search_term;
        const questions = await HelpQuestion.find({$or: [{question_text: {$regex: searchTerm, $options: 'i'}}, {answer_text: {$regex: searchTerm, $options: 'i'}}]})
            .sort('-number_views');

        res.json(questions);
    })
);

module.exports = router;

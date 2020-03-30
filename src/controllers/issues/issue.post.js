const router = require('express').Router();
const errors = require('../../errors');
const {Issue, PackagingReturn} = require('../../schemas');
const emailHelper = require('../../helpers/email-helper');
const authenticate = require('../../middleware/authenticate');
const arrangeInput = require('../../middleware/arrange-inputs');
const Order = require('../../schemas/order');

/**
 *  @swagger
 *  /api/issue:
 *    post:
 *      tags:
 *        - issue
 *      description: submit isue and send email
 *      parameters:
 *        - name: issue_id
 *          description: issue for order/packagingReturn
 *          in: formData
 *          type: string
 *        - name: message
 *          description: issue description
 *          in: formData
 *          type: string
 *      responses:
 *        200:
 *          description: user data
 */

router.post('/api/issue',

    authenticate(),
    arrangeInput('body', {
        issue_id: {
            type: 'STRING',
        },
        message: {
            type: 'STRING',
        },
    }),
    errors.wrap(async (req, res) => {
        console.log("Creating issue");
        console.log(req.body);
        const user = res.locals.user;
        const order = await Order.find({_id: req.body.issue_id});
        const packagingReturn = await PackagingReturn.find({_id: req.body.issue_id});
        if (!order && !packagingReturn) throw errors.NotFoundError('Issue target not found.');
        
        await Issue.create({
            issue_id: req.body.issue_id,
            user_id: user.id,
            message: req.body.message,
            status: 'open',
        });

        await emailHelper.send({
            templateFile: 'issue.pug',
            recipient: user.email,
            preheader : "We heard there might be an issue with your order...",
            subject: 'The Wally Shop: Issue #' + req.body.issue_id,
            name: user.name,
            data: {
                orderId: req.body.issue_id,
                message: req.body.message,
            }
        });

       res.json(order);
    })
);

module.exports = router;

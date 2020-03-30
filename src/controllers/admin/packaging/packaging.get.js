const router = require('express').Router();
const errors = require('../../../errors');
const {Packaging} = require('../../../schemas');
const authenticate = require('../../../middleware/authenticate');

/**
 *  @swagger
 *  /api/admin/packaging:
 *    get:
 *      tags:
 *        - admin/packaging
 *      description: Fetches packaging
 *      responses:
 *        200:
 *          description: packaging schema
 */

 router.get('/api/admin/packaging/:packaging_id',
    errors.wrap(async (req, res) => {
        const packaging = await Packaging.findById(req.params.packaging_id);

        res.json(packaging);
    })
);

module.exports = router;
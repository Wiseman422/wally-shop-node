const router = require('express').Router();
const errors = require('../../errors');
const ads = require('../../enums/ads');

/**
 *  @swagger
 *  /api/web/ad_display:
 *    get:
 *      tags:
 *        - service
 *      description: get links array
 *      responses:
 *        200:
 *          description: array of links
 */

router.get('/api/web/ad_display',
    errors.wrap(async (req, res) => {
        res.json(ads);
    })
);

module.exports = router;

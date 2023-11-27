const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:0bietmatkhau@localhost:5432/lms')

router.get('/', async function(req, res, next) {
    try {
        let { account_id } = req.query || null
        let { activity_type } = req.query || null
        let { activity_target } = req.query || null

        await db.none('insert into activities(account_id, activity_type, activity_target, activity_date) values ($1, $2, $3, now())', [account_id, activity_type, activity_target])
            .then(() => res.send({message: 'Activity updated'}))
    } catch (e) {
        console.log(e)
        next(e)
    }
});

router.get('/chart', async function(req, res, next) {
    try {

        await db.any('SELECT activity_date, COUNT(*) AS activity_count FROM activities GROUP BY activity_date')
            .then(data => res.send(data))
    } catch (e) {
        console.log(e)
        next(e)
    }
});

router.get('/admin', async function(req, res, next) {
    try {
        let { account_id } = req.query || null
        let { activity_type } = req.query || null
        let { activity_target } = req.query || null

        await db.any('select * from activities')
            .then((activities) => res.send(activities))
    } catch (e) {
        console.log(e)
        next(e)
    }
});

module.exports = router;
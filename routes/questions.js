const express = require('express');
const {populate} = require("dotenv");
const router = express.Router();
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:0bietmatkhau@localhost:5432/lms')

router.get('/:course_id', async function (req, res, next) {
    let {course_id} = req.params;
    let questions = {};
    let promises = [];

    await db.any('select * from questions where course_id = $1', [course_id])
        .then(dt => questions = dt)

    res.send(questions);
});

module.exports = router;
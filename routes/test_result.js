// Hiển thị kết quả bài kiểm tra
const express = require('express');
const {populate} = require("dotenv");
const router = express.Router();
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:0bietmatkhau@localhost:5432/lms')

router.get('/:st_id', async function (req, res, next) {
    let {st_id} = req.params;
    let question = [];
    let result = [];

    await db.any('select * from test_results where st_id = $1', [st_id])
        .then(data => {
            result = data
        })

    result.map(
        rs => question.push(
            db.any('select answers, question_title from questions where question_id = $1', [rs.question_id])
                .then(qs => {
                    rs.question_title = qs[0].question_title
                    rs.answers = qs[0].answers
                })
        )
    )

    await Promise.all(question)

    res.send(result);
});

module.exports = router;
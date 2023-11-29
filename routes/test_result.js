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
            db.any('select answers, question_title, question_score from questions where question_id = $1', [rs.question_id])
                .then(qs => {
                    rs.question_title = qs[0].question_title
                    rs.answers = qs[0].answers
                    rs.score = qs[0].question_score
                })
        )
    )

    await Promise.all(question)

    res.send(result);
});

router.get('/test/:st_id', async function (req, res, next) {
    try {
        let {st_id} = req.params;
        let questions = []
        let score = 0;
        let promises = []

        await db.one('select * from students_tests where st_id = $1', [st_id])
            .then(data => {
                questions = data.questions
            })

        questions.forEach(question => {
            promises.push(promises.push(db.one('select question_score from questions where question_id = $1', [question]).then(q => score += q.question_score)))
        })

        await Promise.all(promises).then(() => {
            console.log(score)
            res.send({question_score: score})
        })
    } catch (e) {
        console.log(e)
        next(e)
    }
});

module.exports = router;
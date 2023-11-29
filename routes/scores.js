// Xem thêm sửa xóa điểm kiểm tra
const express = require('express');
const {populate} = require("dotenv");
const router = express.Router();
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:0bietmatkhau@localhost:5432/lms')

router.get(
    '/:test_id',
    async function (req, res, next) {
        try {
            let {test_id} = req.params
            let tests = []
            let promises1 = []

            await db.any('select * from students_tests where test_id = $1', [test_id])
                .then((data) => tests = data)

            for (const test of tests) {
                let promises = []
                let score = 0

                test.questions.forEach(question => {
                    promises.push(db.one('select question_score from questions where question_id = $1', [question]).then(dt => score += 1))
                })

                await Promise.all(promises).then(() => test.max_score = score)
            }

            for (const test of tests) {
                let promises = []
                let score = 0;
                promises.push(db.any('select * from test_results where st_id = $1 and student_id = $2', [test.st_id, test.student_id]).then((data) => {
                    data.forEach(dt => {
                        if (dt.student_answers === dt.correct_answers) {
                            score += 1
                        }
                    })
                }))

                await Promise.all(promises).then(() => test.score = score)
            }

            res.send(tests)

        } catch (e) {
            console.log(e)
            next(e)
        }
    }
)

module.exports = router;
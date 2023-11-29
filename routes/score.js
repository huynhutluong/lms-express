// Xem thêm sửa xóa điểm kiểm tra
const express = require('express');
const {populate} = require("dotenv");
const router = express.Router();
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:0bietmatkhau@localhost:5432/lms')

router.post(
    '/',
    async function (req, res, next) {
        try {
            let {st_id, student_id, score_number, max_score} = req.body

            await db.none('insert into scores(st_id, student_id, score_number, max_score, created_at) values ($1, $2, $3, now())', [st_id, student_id, score_number, max_score])
                .then(() => res.send({message: 'successfully updated'}))
        } catch (e) {
            console.log(e)
            next(e)
        }
    }
)

module.exports = router;
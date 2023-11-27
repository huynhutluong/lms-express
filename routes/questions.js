const express = require('express');
const {populate} = require("dotenv");
const router = express.Router();
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:0bietmatkhau@localhost:5432/lms')

router.get('/', async function (req, res, next) {
    try {
        let questions = {};
        let promises = [];
        let { course_id } = req.query
        if (course_id) {
            await db.any('select * from questions where course_id = $1 and active = $2', [course_id, true])
                .then(dt => questions = dt)
                .then(() => res.send(questions))
        } else {
            await db.any('select * from questions where active = $1', [true])
                .then(dt => questions = dt)
                .then(() => res.send(questions))
        }
    } catch (e) {
        next(e);
    }
});

router.get('/:question_id', async function (req, res, next) {
    try {
        let {question_id} = req.params;
        let questions = {};

        await db.one('select * from questions where question_id = $1', [question_id])
            .then(dt => questions = dt)
            .then(() => res.send(questions))
    } catch (e) {
        next(e)
    }
});

router.post('/', async function (req, res, next) {
    try {
        let { course_id, question_title, question_score, phan_loai, answers, correct_answer } = req.body;

        switch (phan_loai) {
            case 'E':
                question_score = 10
                break
            case 'M':
                question_score = 20
                break
            case 'H':
                question_score = 30
                break
            default:
                question_score = 10
        }

        await db.any('select count(*) from questions where course_id = $1', [course_id])
            .then(async (data) => {
                await db.none('INSERT INTO questions(question_id, course_id, question_title, question_score, phan_loai, answers, correct_answer) values ($1, $2, $3, $4, $5, $6, $7)', [course_id + 'q' + data[0].count, course_id, question_title, question_score, phan_loai, answers, correct_answer])
            })

        res.status(200).send({message: "success"});
    } catch (e) {
        next(e)
    }
});

router.put('/', async function (req, res, next) {
    try {
        let {question_id, question_title, question_score, phan_loai, answers, correct_answer} = req.body

        switch (phan_loai) {
            case 'E':
                question_score = 10
                break
            case 'M':
                question_score = 20
                break
            case 'H':
                question_score = 30
                break
            default:
                question_score = 10
        }

        await db.none('update questions set question_title = $2, question_score = $3, phan_loai = $4, answers = $5, correct_answer = $6 where question_id = $1', [question_id, question_title, question_score, phan_loai, answers, correct_answer])
            .then(() => {
                res.status(200).send({ message: 'Question updated successfully' })
            })
    } catch (e) {
        res.status(500).json({ error: 'Internal Server Error' });
        next(e)
    }
})

router.delete('/', async function (req, res, next) {
    try {
        let {question_id} = req.body

        await db.none('update questions set active = $2 where question_id = $1', [question_id, false])
            .then(() => {
                res.status(200).send({ message: 'Question deleted successfully' })
            })
    } catch (e) {
        console.log(e)
        next(e)
    }
})

module.exports = router;
// Lấy thông tin bài kiểm tra
// Thêm sửa xóa bài kiểm tra

const express = require('express');
const {populate} = require("dotenv");
const router = express.Router();
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:0bietmatkhau@localhost:5432/lms')

router.get('/:test_id', async function (req, res, next) {
    let {test_id} = req.params;
    let test = {};
    let promises = [];

    await db.one('select * from tests where test_id = $1', [test_id])
        .then(res => {
            test = res
        })

    res.send(test);
});

router.get('/:test_id/:st_id', async function (req, res, next) {
    let {test_id, st_id} = req.params;
    let questions = [];
    let test = {};
    let promises = [];

    await db.one('select * from students_tests where st_id = $1', [st_id])
        .then(res => {
            test = res
        })

    test.questions.forEach(question => promises.push(db.one('select * from questions where question_id = $1', [question]).then(q => questions.push(q))))

    await Promise.all(promises).then(() => test.questions = questions)

    res.send(test);
});

//Khởi tạo bài kiểm tra
router.post('/generate', async function (req, res, next) {
    let {test_id, student_id, total_time, easy_questions, medium_questions, hard_questions} = req.body;
    let promises = [];
    let questions = [];
    let started_at = new Date()
    let ended_at = new Date(started_at.getTime() + parseInt(total_time))

    console.log(total_time)


    promises.push(db.any('select question_id from questions where phan_loai = $1 order by random() limit $2', ["E", easy_questions]).then(eqs => eqs.map(eq => questions.push(eq.question_id))))
    promises.push(db.any('select question_id from questions where phan_loai = $1 order by random() limit $2', ["M", medium_questions]).then(mqs => mqs.map(mq => questions.push(mq.question_id))))
    promises.push(db.any('select question_id from questions where phan_loai = $1 order by random() limit $2', ["H", hard_questions]).then(hqs => hqs.map(hq => questions.push(hq.question_id))))

    await Promise.all(promises)
        .then(async () => await db.none('insert into students_tests(st_id, student_id, test_id, started_at, ended_at, total_time, questions) values ($1, $2, $3, $4, $5, $6, $7)', [student_id + test_id, student_id, test_id, started_at, ended_at, total_time, questions])
        )

    res.send({st_id: student_id + test_id, test_id: test_id, student_id: student_id, started_at, ended_at, questions});
});

// Nộp bài, lấy danh sách câu trả lời đúng từ db, câu trả lời của hs từ frontend để lưu vào db,
router.post('/submit', async function (req, res, next) {
    let {st_id, student_id, answers} = req.body;
    let promises = [];
    let dt = [];

    for (let [key, value] of Object.entries(answers)) {
        await db.one('select correct_answer from questions where question_id = $1', [key])
            .then(async (res) => {
                await db.none('insert into test_results(result_id, st_id, student_id, question_id, student_answers, correct_answers, created_at) values ($1,$2,$3,$4,$5,$6,now())', [st_id+student_id+key, st_id, student_id,key,value,res.correct_answer]).then()
            })
    }

    await Promise.all(promises).then()

    res.status(201).send({message: "^.^"});
});

router.post('/', async function (req, res, next) {
    try {
        let {section_id, course_id, test_name, test_password, test_time, easy_questions, medium_questions, hard_questions} = req.body
        let test_questions = easy_questions + medium_questions + hard_questions

        await db.none('insert into tests(test_id, section_id, course_id, test_name, test_password, test_time, easy_questions, medium_questions, hard_questions, test_questions, created_at) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now())',
            [section_id + 't' + Date.now(), section_id, course_id, test_name, test_password, test_time, easy_questions, medium_questions, hard_questions, test_questions])

        res.send({message: 'Added successfully'})
    } catch (e) {
        console.log(e)
        next(e)
    }
});

module.exports = router;
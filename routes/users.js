// Hiển thị danh sách tài khoản người dùng
// Hiển thị danh sách người dùng theo nhóm (student hoặc lecturer)
// Cập nhật thông tin người dùng

const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:0bietmatkhau@localhost:5432/lms')

/* GET users listing. */

router.get('/', async function (req, res, next) {
    try {
        let users = [];
        let {account_username} = req.query || ''

        if (account_username) {
            await db.any('SELECT account_id, account_username, last_logged_in, account_role from accounts where account_username like $2 and active = $1', [true, account_username + '%'])
                .then((data) => users = data)
        } else {
            await db.any('SELECT account_id, account_username, last_logged_in, account_role from accounts where active = $1', [true])
                .then((data) => users = data)
        }

        res.send(users);
    } catch (e) {
        console.log(e)
        next(e)
    }
});

router.get('/student/:student_id', async function (req, res, next) {
    try {
        let {student_id} = req.params;
        let student = {};
        await db.one('SELECT * from students s, accounts a where s.account_id = a.account_id and s.student_id = $1', [student_id])
            .then(data => {
                student = data
                console.log(student)
                return data
            })
            .then(async (data) => {
                await db.any('select * from activities where account_id = $1 order by activity_date desc', [data.account_id])
                    .then(data1 => student.activities = data1)
            })
            .then(() => res.send(student))
    } catch (e) {
        console.log(e)
        next(e)
    }
});

router.get('/lecturers', async function (req, res, next) {
    try {
        let lecturers = [];
        await db.any('SELECT * from accounts, lecturers where accounts.active = $1', [true])
            .then((data) => {
                lecturers = data
            })
            .then(() => res.send(lecturers))
    } catch (e) {
        console.log(e)
        next(e)
    }
});

router.put('/student', async function (req, res, next) {
    try {
        let {student_id, student_fullname, student_gt, student_email} = req.body
        await db.none('update students set student_fullname = $2, student_email = $3, student_gt = $4 where student_id = $1', [student_id, student_fullname, student_email, student_gt])
            .then(() => res.status(200).send({message: "Account updated successfully"}))
    } catch (e) {
        console.log(e)
        next(e)
    }
});

router.delete('/student', async function (req, res, next) {
    try {
        let {account_id} = req.body
        await db.none('update accounts set active = $2 where account_id = $1', [account_id, false])
            .then(() => res.status(200).send({message: "Account deleted successfully"}))
    } catch (e) {
        console.log(e)
        next(e)
    }
});

//Ch
router.put('/', async function (req, res, next) {
    try {
        let {account_role, account_id} = req.body
        await db.none('update accounts set account_role = $1 where account_id = $2', [account_role, account_id])
            .then(() => res.status(200).send({message: "Account updated successfully"}))
    } catch (e) {
        console.log(e)
        next(e)
    }
});

module.exports = router;

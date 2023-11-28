const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:0bietmatkhau@localhost:5432/lms')

router.get('/', async function (req, res, next) {
    try {
        let {account_id} = req.query
        let user = {};

        await db.one('select account_id, account_username, account_role, last_logged_in from accounts where account_id = $1', [account_id])
            .then(async (data) => {
                console.log(data)
                if (data.account_role === 'student') {
                    await db.one('select student_fullname, student_email, student_gt from students where account_id = $1', [account_id])
                        .then(data1 => res.send({
                            account_id: data.account_id,
                            account_username: data.account_username,
                            student_fullname: data1.student_fullname,
                            student_email: data1.student_email,
                            student_gt: data1.student_gt
                        }))
                }
            })

    } catch (e) {
        console.log(e)
        next(e)
    }
});

router.put('/student', async function (req, res, next) {
    try {
        let {account_id, student_fullname, student_email, student_gt} = req.body

        await db.none('update students set student_fullname = $2, student_email = $3, student_gt = $4 where account_id = $1', [account_id, student_fullname, student_email, student_gt])
            .then(() => res.send({message: "Updated successfully"}))

    } catch (e) {
        console.log(e)
        next(e)
    }
});

router.put('/password', async function (req, res, next) {
    try {
        let {account_id, old_password, new_password} = req.body

        await db.one('select account_password from accounts where account_id = $1', [account_id])
            .then(async (data) => {
                if (data.account_password === old_password) {
                    await db.none('update accounts set account_password = $2 where account_id = $1', [account_id, new_password])
                        .then(() => res.send({message: "Updated successfully"}))
                } else {
                    res.status(500).send({message: 'Sai mật khẩu'})
                }
            })

    } catch (e) {
        console.log(e)
        next(e)
    }
});

module.exports = router;
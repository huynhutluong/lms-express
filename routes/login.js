// Đăng nhập

const express = require('express');
const { errors } = require("pg-promise");
const router = express.Router();
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:0bietmatkhau@localhost:5432/lms')

router.get('/', async function (req, res, next){
    let { account_username } = req.query;
    let account = [];

    await db.none('update accounts set last_logged_in = now() where account_username = $1', [account_username])
        .then()

    await db.one('select account_username, account_role, last_logged_in from accounts where account_username = $1', [account_username])
        .then(data => {
            account = data
        })

    res.send(account);
})

router.post('/', async function (req, res, next) {
    let { account_username, account_password } = req.body;
    let user = [];
    await db
        .one('SELECT account_username, account_password from accounts where account_username = $1', [account_username])
        .then((data) => {
            user = data
        })
        .catch((error) => {
            console.log('ERROR:', error)
        });
    if (user.account_password === account_password) {
        res.send({
            account_username,
            account_password,
            token: 'token123'
        })
    } else {
        const error = new Error('Something went wrong, please try again!');
        return next(error)
    }
});

module.exports = router;
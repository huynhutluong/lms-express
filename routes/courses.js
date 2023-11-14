// Hiển thị danh sách học phần
// Thêm học phần mới

const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:0bietmatkhau@localhost:5432/lms')

router.get('/', async function (req, res, next) {
    let courses = [];
    await db
        .any('SELECT * from courses')
        .then((data) => {
            courses = data
        })
        .catch((error) => {
            console.log('ERROR:', error)
        });
    res.send(courses);
});

module.exports = router;
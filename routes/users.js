// Hiển thị danh sách tài khoản người dùng
// Hiển thị danh sách người dùng theo nhóm (student hoặc lecturer)
// Cập nhật thông tin người dùng

const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:0bietmatkhau@localhost:5432/lms')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let student = [];
  await db.any('SELECT * from students')
      .then((data) => {
        student = data
      })
      .catch((error) => {
        console.log('ERROR:', error)
      })
  res.send(student);
});

module.exports = router;

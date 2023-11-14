// Thêm sửa xóa bài đăng

const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:0bietmatkhau@localhost:5432/lms')

router.get('/:section_id', async function (req, res, next) {
    let { section_id } = req.params;
    let posts = [];
    await db
        .any('SELECT * from posts where section_id = $1', [section_id])
        .then((data) => {
            posts = data
        })
        .catch((error) => {
            console.log('ERROR:', error)
        });
    res.send(posts);
});

router.post('/', async function (req, res, next) {
    let { owner, section_id, post_title, post_description } = req.body;
    await db
        .none('insert into posts(post_id, section_id, post_title, post_description, created_at) values ($1, $2, $3, $4, now())', [owner + section_id + Date.now(), section_id, post_title, post_description])
        .then(() => res.send({owner, section_id, post_title, post_description}))

});

router.delete('/:post_id', async function (req, res, next) {
    let { post_id } = req.params;

    await db.none('delete from posts where post_id = $1', [post_id])
        .then()

    res.send({message: 'ok'})
});

module.exports = router;
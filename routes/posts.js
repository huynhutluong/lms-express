// Thêm sửa xóa bài đăng

const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:0bietmatkhau@localhost:5432/lms')

router.get('/:section_id', async function (req, res, next) {
    try {
        let {section_id} = req.params;
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
    } catch (e) {
        console.log(e)
        next(e)
    }
});

router.post('/', async function (req, res, next) {
    try {
        let {owner, section_id, post_title, post_description} = req.body;
        await db
            .none('insert into posts(post_id, section_id, post_title, post_description, created_at) values ($1, $2, $3, $4, now())', [owner + section_id + Date.now(), section_id, post_title, post_description])
            .then(() => res.send({owner, section_id, post_title, post_description}))
    } catch (e) {
        console.log(e)
        next(e)
    }
});

router.delete('/:post_id', async function (req, res, next) {
    try {
        let {post_id} = req.params;

        await db.none('update posts set active = $2 where post_id = $1', [post_id, false])
            .then(() => res.status.send({message: 'Post deleted successfully'}))
    } catch (e) {
        console.log(e)
        next(e)
    }
});

module.exports = router;
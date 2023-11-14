// Thêm sửa xóa file
const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:0bietmatkhau@localhost:5432/lms')
const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/files');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

var upload = multer({ storage: storage })

router.get('/:section_id', async function (req, res, next) {
    let { section_id } = req.params;
    let files = {};
    await db.any('select * from files where section_id = $1', [section_id])
        .then(res => files = res)

    res.send(files)
});

router.post('/', upload.single('file'), async function (req, res, next) {
    let { owner, section_id } = req.query;
    let file_name = req.file.filename;
    let file_address = 'files/' + req.file.filename;

    await db.none('insert into files(file_id, section_id, file_name, file_address, owner, created_at) values ($1, $2, $3, $4, $5, now())',
        [owner + section_id + Date.now(), section_id, file_name, file_address, owner]
    )

    res.status(200).send({file_name, file_address});
});

router.delete('/delete/:file_id', async function (req, res, next) {
    let {file_id} = req.params;

    await db.none('delete from files where file_id = $1', [file_id])
        .then()

    res.send({message: 'ok'})
});

module.exports = router;
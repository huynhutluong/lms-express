const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:0bietmatkhau@localhost:5432/lms')

router.get('/:class_id', async function (req, res, next) {
    let {class_id} = req.params;
    let promises = [];
    let sections;

    await db.any('select * from sections where class_id = $1', [class_id])
        .then(count => sections = count)
        .catch(error => {
            console.log(error);
        });

    res.send(sections)
});

router.post('/:class_id', async function (req, res, next) {
    let {class_id} = req.params;
    let promises = [];
    let sections;

    await db.any('select * from sections where class_id = $1', [class_id])
        .then(async (data) => {
            console.log(data)
            await db.none('INSERT INTO sections(section_id, class_id, section_name) VALUES($1, $2, $3)', [class_id + 's' + Date.now(), class_id,'Chủ đề '+ (data.length + 1)])
                .then()
                .catch(error => {
                    console.log(error);
                })
        })

    res.send({message: 'ok'})
});

router.delete('/delete/:section_id', async function (req, res, next) {
    let {section_id} = req.params;

    await db.none('delete from sections where section_id = $1', [section_id])
        .then()

    res.send({message: 'ok'})
});


module.exports = router;
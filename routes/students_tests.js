const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:0bietmatkhau@localhost:5432/lms')

router.get('/:test_id/:student_id', async function (req, res, next) {
    let {test_id, student_id} = req.params;
    let promises = [];

    await db.any('select * from students_tests where test_id = $1 and student_id = $2', [test_id, student_id])
        .then(data => {
            if (data.length > 0) {
                res.send(data)
            }
            else {
                res.status(404).send('Not found')
            }
        });

});

// router.post('/:test_id/:student_id', async function (req, res, next) {
//     let {test_id, student_id} = req.params;
//     let promises = [];
//
//     await db.any('select * from students_tests where test_id = $1 and student_id = $2', [test_id, student_id])
//         .then(data => {
//             if (data.length > 0) {
//                 res.send(data)
//             }
//             else {
//                 res.status(404).send('Not found')
//             }
//         });
//
// });

module.exports = router;
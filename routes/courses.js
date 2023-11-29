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
            data.map(dt => courses.push({
                key: dt.course_id,
                text: dt.course_name,
                value: dt.course_id
            }))
        })
        .catch((error) => {
            next(error)
        });
    console.log(courses)
    res.send(courses);
});

router.get(
    '/student/:id',
    async function (req, res, next) {
        try {
            const {id} = req.params;
            console.log(id)
            await db
                .any('SELECT * from classes_students cs, classes c, courses a where cs.class_id = c.class_id and c.course_id = a.course_id and cs.student_id = $1',
                    [id]
                )
                .then(data => {
                    res.send(data)
                })
            // await db
            //     .any('SELECT * from classes_students where student_id = $1', [id])
            //     .then(data => {
            //         res.send(data)
            //     })
        } catch (e) {
            console.log(e)
        }

    }
)

module.exports = router;
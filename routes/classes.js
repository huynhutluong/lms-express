// Hiển thị danh sách các lớp học
// Hiển thị danh sách các lớp học của sinh viên a trong ngày
// Hiển thị danh sách các lớp học mà sinh viên đăng ký
// Thêm lớp học mới
// Chỉnh sửa thông tin lớp học
// Xóa lớp học

const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:0bietmatkhau@localhost:5432/lms')

router.get('/', async function (req, res, next) {
    let classes = [];
    let { today, student_id } = req.query;

    if (!today && !student_id) {
        await db
            .any('SELECT classes.class_id, classes.lecturer_id, classes.class_description, courses.course_name, lecturers.lecturer_fullname, categories.category_name from classes, courses, lecturers, categories where classes.course_id = courses.course_id and classes.lecturer_id = lecturers.lecturer_id and courses.category_id = categories.category_id')
            .then((data) => {
                classes = data
                res.send(classes);
            })
            .catch((error) => {
                console.log('ERROR:', error)
            });
    } else if (student_id && !today) {
        await db
            .any('SELECT * from classes c, classes_students cs where c.class_id = cs.class_id and student_id = $1', [student_id])
            .then((data) => {
                classes = data
                res.send(classes);
            })
            .catch((error) => {
                console.log('ERROR:', error)
            });
    } else if (student_id && today) {
        await db
            .any('SELECT cs.class_id, cs.student_id, c.course_name, cl.class_start, cl.class_end FROM classes_students cs, classes cl, courses c where cs.class_id = cl.class_id and cl.course_id = c.course_id and cs.student_id = $1 and cl.class_date = $2',
                [student_id, today])
            .then((data) => {
                classes = data
                res.send(classes);
            })
            .catch((error) => {
                console.log('ERROR:', error)
            });
    }
});

router.get(
    '/:id',
    async function (req, res, next) {
        const student_id = req.params.id;
        let classes = [];
        await db
            .any('SELECT c.class_id, d.course_name, e.lecturer_fullname FROM classes_students c, classes a, students b, courses d, lecturers e where c.student_id = $1 and a.class_id = c.class_id and b.student_id = c.student_id and a.course_id = d.course_id and a.lecturer_id = e.lecturer_id',
                [student_id]
            )
            .then(data => {
                classes = data
            })
            .catch((error) => {
                console.log('ERROR:', error)
            });
        res.send(classes)
    }
)

router.get(
    '/query/:q',
    async function (req, res, next) {
        const {q} = req.params;
        let classes = [];
        await db
            .any('SELECT * FROM classes a, courses d, lecturers e, categories b where a.course_id = d.course_id and a.lecturer_id = e.lecturer_id and d.category_id = b.category_id and d.course_name like $1', ['%' + q + '%'])
            .then(data => {
                classes = data
            })
            .catch((error) => {
                console.log('ERROR:', error)
            });
        console.log(classes)
        res.send(classes)
    }
)

router.get(
    '/:id/:num',
    async function (req, res, next) {
        const student_id = req.params.id;
        const number = req.params.num || 3;
        let classes = [];
        await db
            .any('SELECT c.class_id, d.course_name, e.lecturer_fullname FROM classes_students c, classes a, students b, courses d, lecturers e where c.student_id = $1 and a.class_id = c.class_id and b.student_id = c.student_id and a.course_id = d.course_id and a.lecturer_id = e.lecturer_id LIMIT $2',
                [student_id, number]
            )
            .then(data => {
                classes = data
            })
            .catch((error) => {
                console.log('ERROR:', error)
            });
        res.send(classes)
    }
)

router.get(
    '/v2/lecturers/:lecturer_id',
    async function (req, res, next) {
        const { lecturer_id } = req.params;
        let classes = [];
        await db
            .any('select * from classes, courses where lecturer_id = $1 and classes.course_id = courses.course_id',
                [lecturer_id]
            )
            .then(data => {
                classes = data
            })
            .catch((error) => {
                console.log('ERROR:', error)
            });
        res.send(classes)
    }
)

//Sai
router.get(
    '/q/:key_word',
    async function (req, res, next) {
        const {key_word} = req.params;
        let classes = [];
        await db
            .any('SELECT c.class_id, d.course_name, e.lecturer_fullname FROM classes_students c, classes a, students b, courses d, lecturers e where d.course_name like $1 and a.class_id = c.class_id and b.student_id = c.student_id and a.course_id = d.course_id and a.lecturer_id = e.lecturer_id',
                ['%' + key_word + '%']
            )
            .then(data => {
                classes = data
            })
            .catch((error) => {
                console.log('ERROR:', error)
            });
        res.send(classes)
    }
)

module.exports = router;
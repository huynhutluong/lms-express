// Đăng ký lớp, rút tên khỏi lớp
// Hiển thị nội dung lớp học theo mã lớp

const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')()
const db = pgp('postgres://postgres:0bietmatkhau@localhost:5432/lms')

router.get('/', async function (req, res, next) {
    let {class_id, student_id} = req.query;
    let klasse = [];

    if (class_id && student_id) {
        await db.one('SELECT * from classes_students cs, courses c, classes cl where cs.class_id = cl.class_id and c.course_id = cl.course_id and cs.class_id = $1 and cs.student_id = $2', [class_id, student_id])
            .then((data) => {
                if (data) {
                    klasse = data;
                    res.send(klasse);
                }
            })
            .catch((error) => {
                // let err = new Error("Error");
                res.send('');
            })
    } else {
        res.send({message: "Insert some param please!"});
    }
});

// Lay thong tin lop hoc
router.get('/:class_id', async function (req, res, next) {
    let { class_id } = req.params;
    let sections = {};
    let promises = [];

    await db.any('select s.section_id, s.section_name, s.class_id, cs.course_name from sections s, classes cl, courses cs where s.class_id = $1 and s.class_id = cl.class_id and cs.course_id = cl.course_id order by s.section_name', [class_id])
        .then(res => {
            sections = res
        })

    sections.forEach(section => {
        promises.push(db.any('select * from files where section_id = $1 and active = $2', [section.section_id, true]).then(files => section.files = files))
    })

    sections.forEach(section => {
        promises.push(db.any('select * from posts where section_id = $1 and active = $2', [section.section_id, true]).then(posts => section.posts = posts))
    })

    sections.forEach(section => {
        promises.push(db.any('select * from tests where section_id = $1 and active = $2', [section.section_id, true]).then(tests => section.tests = tests))
    })

    await Promise.all(promises)

    res.send(sections)
});

router.post('/', async function (req, res, next) {
    let {student_id, class_id} = req.body;
    await db.none('INSERT INTO classes_students(student_id, class_id, created_at) VALUES($1, $2, now())', [student_id, class_id])
        .then(() => {
            res.send({message: 'ok'});
        })
        .catch(error => {
            console.log(error);
        });
});

router.delete('/', async function (req, res, next) {
    let {student_id, class_id} = req.body;
    await db.none('DELETE FROM classes_students WHERE student_id = $1 and class_id = $2', [student_id, class_id])
        .then(() => {
            res.send({message: 'ok'});
        })
        .catch(error => {
            console.log(error);
        });
});

module.exports = router;
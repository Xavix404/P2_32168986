import express from 'express';
const router = express.Router();

router.get('/', (_req, res) => {
    res.render('index', {
        title: "Si",
    })
})

export default router;
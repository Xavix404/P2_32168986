import express from "express";
const router = express.Router();

router.get('/about', (_req, res) => {
    res.render('about', {
        title: "RefriExpert | about",
    })
})

export default router;
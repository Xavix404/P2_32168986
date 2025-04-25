import express from "express";
const router = express.Router();

router.get('/contact', (_req, res) => {
    res.render('contact', {
        title: "RefriExpert | contact",
    })
})

export default router;
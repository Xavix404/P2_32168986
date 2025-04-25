import express from "express";
const router = express.Router();

router.get('/services', (_req, res) => {
    res.render('services', {
        title: "RefriExpert | services",
    })
})

export default router;
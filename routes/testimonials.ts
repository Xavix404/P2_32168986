import express from "express";
const router = express.Router();

router.get('/testimonials', (_req, res) => {
    res.render('testimonials', {
        title: "RefriExpert | testimonials",
    })
})

export default router;
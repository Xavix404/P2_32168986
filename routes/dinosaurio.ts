import express from "express";
const router = express.Router();

router.get('/dinosaurio', (_req, res) => {
    res.render('dinosaurio', {
        title: "easterEgg",
    })
})

export default router;
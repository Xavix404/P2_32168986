import express from "express";
const router = express.Router();

router.get('/', (_req: any, res: any) => {
    res.render('index', {
        title: "",
    })
})

export default router;
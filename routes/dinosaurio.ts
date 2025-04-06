import express from "express";
const router = express.Router();

router.get('/dinosaurio', (_req: any, res: any) => {
    res.render('dinosaurio', {
        title: "dinosaurio",
        text: "Hola Mandarina"
    })
})

export default router;
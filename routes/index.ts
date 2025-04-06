import express from "express";
const router = express.Router();

router.get('/', (_req: any, res: any) => {
    res.render('index', {
        title: "DinoApp",
        text: "Hola Mundo",
        nombres: "Victor Xavier",
        apellidos: "Misel Marquez",
        ci: 32168986,
        seccion: 4
    })
})

export default router;
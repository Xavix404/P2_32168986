const express = require('express')
const clear = require('console-clear');
const app = express()
const port = 3000
clear(true);

//motor de plantillas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//router
app.get('/', (_req: any, res: any) => {
    res.render('index', {
        title: "DinoApp",
        text: "Hola Mundo",
        nombre: "Victor",
        apellido: "Misel",
        ci: 32168986,
        seccion: 4
    })
})

app.get('/dinosaurio', (_req: any, res: any) => {
    res.render('dinosaurio', {
        title: "dinosaurio",
        text: "Hola Mandarina"
    })
})

//midleware
app.use(express.static (__dirname + "/public"));

app.use((_req: any, res: any, _next: any) => {
    res.status(404).render("404", {title: "404"})
})

app.listen(port, () => {
    console.log(`server listening on port: http://localhost:${port}`)
})
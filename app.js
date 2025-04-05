const express = require('express')
const app = express()
const port = 3000

//motor de plantillas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//router
app.get('/', (req, res) => {
    res.render('index', {
        title: "Hola Mundo",
        nombre: "Victor",
        apellido: "Misel",
        ci: 32168986,
        seccion: 4
    })
})

app.get('/dinosaurio', (req, res) => {
    res.render('dinosaurio', {title: "Hola Mandarina"})
})

//midleware
app.use(express.static (__dirname + "/public"));

app.use((req, res, next) => {
    res.status(404).sendFile(__dirname + "views/404.ejs")
})

app.listen(port, () => {
    console.log(`server listening on port: http://localhost:${port}`)
})
import  express  from 'express';
import clear from 'console-clear';
import bodyParser from 'body-parser';
import path from 'path';

const app = express()
const PORT = process.env.PORT || 8080;
clear(true);

//desactivar el header x-powered-by
app.disable('x-powered-by');

//body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

//motor de plantillas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//invocando modulos
import indexRouter from './routes/index';



//rutas
app.use('/', indexRouter);

app.use(express.static (__dirname + "/public"));

//error 404
app.use((_req, res) => {
    res.status(404).render("404", {title: "404"})
})

//sever escuchando
app.listen(PORT, () => {
    console.log(`server listening on port: http://localhost:${PORT}`)
})
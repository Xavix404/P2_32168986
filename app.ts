import  express  from 'express';
import clear from 'console-clear';
import bodyParser from 'body-parser';

const app = express()
const PORT = process.env.PORT || 3000;
clear(true);

//desactivar el header x-powered-by
app.disable('x-powered-by');

//body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

//middleware para archivos estaticos
app.use(express.static (__dirname + "/public"));

//motor de plantillas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//invocando modulos
import router from './routes/router';

//router
app.use('/', router);
app.use('/admin', router);

//error 404
app.use((_req, res) => {
    res.status(404).render("404", {title: "404"})
})

//sever escuchando
app.listen(PORT, () => {
    console.log(`server listening on port: http://localhost:${PORT}`)
})
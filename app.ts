import  express  from "express";
import clear from 'console-clear';
const app = express()
const port = 3000
clear(true);

//invocando modulos
import indexRouter from './routes/index';
import aboutRouter from './routes/about';
import servicesRouter from './routes/services';
import testimonialsRouter from './routes/testimonials';
import contactRouter from './routes/contact';

//motor de plantillas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//rutas
app.use('/', indexRouter);
app.use('/', aboutRouter);
app.use('/', servicesRouter);
app.use('/', testimonialsRouter);
app.use('/', contactRouter);

//midleware
app.use(express.static (__dirname + "/public"));

//error 404
app.use((_req, res, _next) => {
    res.status(404).render("404", {title: "404"})
})

//sever escuchando
app.listen(port, () => {
    console.log(`server listening on port: http://localhost:${port}`)
})
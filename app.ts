import express from 'express';
import clear from 'console-clear';
import bodyParser from 'body-parser';
import { ContactsModel } from './models/Model';
import router from './routes/router';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

dotenv.config();

const app = express();
app.set('trust proxy', true);
const PORT = process.env.PORT || 3000;
clear(true);

// Deshabilita el header 'x-powered-by' por seguridad
app.disable('x-powered-by');

// Middleware para parsear JSON en las peticiones
app.use(bodyParser.json());
// Middleware para parsear datos de formularios (urlencoded)
app.use(bodyParser.urlencoded({ extended: true }));

// Sirve archivos estáticos desde la carpeta 'public'
app.use(express.static(__dirname + "/public"));

// Configura EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Configuración de la sesión
app.use(session({
    secret: process.env.SESSION_SECRET || 'tu_clave_secreta',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax', 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000 // 15 minutos en milisegundos
    }
}));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!
},
function(accessToken, refreshToken, profile, done) {
    // Aquí puedes buscar/crear el usuario en tu base de datos
    // Por simplicidad, solo pasamos el perfil
    return done(null, profile);
}
));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj as any);
});

app.use(passport.initialize());
app.use(passport.session());

// Middleware para mantener la sesión activa
app.use((req, res, next) => {
    if (req.session) {
        req.session.touch();
    }
    next();
});

// Usa el router principal
app.use('/', router);

// Middleware para manejar rutas no encontradas (404)
app.use((_req, res) => {
    res.status(404).render("404", { title: "404" });
});

// Middleware global de manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).render('500', { title: 'Error del servidor' });
});

// Función principal para iniciar el servidor y la base de datos
async function startServer() {
    // Inicializa la base de datos y crea la tabla si no existe
    await ContactsModel.initDb();
    await ContactsModel.createTable();

    // Inicia el servidor en el puerto especificado
    app.listen(PORT, () => {
        console.log(`server listening on port: http://localhost:${PORT}`);
    });
}

// Inicia la aplicación
startServer();
import express from 'express';
import { contactControler } from '../controlers/Controler';
import passport from 'passport';

// Extiende la interfaz de Session para incluir isLoggedIn, isAdmin y userId
declare module 'express-session' {
  interface SessionData {
    isLoggedIn?: boolean;
    isAdmin?: boolean;
    userId?: number;
    username?: string;
  }
}

// Middleware para proteger la ruta admin
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (
        req.session &&
        req.session.userId &&
        req.session.username === 'admin' &&
        req.session.isAdmin === true
    ) {
        return next();
    }
    res.status(403).render('login', { error: 'Acceso solo para administradores.' });
}

const router = express.Router();

router.get('/', contactControler.getALL);
router.post('/send', contactControler.validateData, contactControler.add);
// Protege la ruta admin:
router.get('/admin', requireAdmin, contactControler.getContacts);
router.post('/admin/clear', contactControler.clearContacts);
router.get('/payment', contactControler.getPayment);
router.post('/payment', contactControler.processPayment);
router.get('/register', contactControler.getRegister);
router.post('/register', contactControler.registerUser);
router.get('/login', contactControler.getLogin);
router.post('/login', contactControler.loginUser);
router.get('/logout', contactControler.logoutUser);
router.post('/logout', contactControler.logoutUser);

// Iniciar login con Google
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback de Google
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Guarda en la sesión que el usuario está logueado
    if (req.user) {
      req.session.userId = (req.user as any).id || (req.user as any).email || 'googleUser';
      req.session.isLoggedIn = true;
      // Si quieres, puedes detectar si es admin por email:
      req.session.isAdmin = (req.user as any).emails && (req.user as any).emails[0].value === 'admin@tucorreo.com';
    } else {
      req.session.userId = 0; // or another appropriate number as a fallback
      req.session.isLoggedIn = true;
      req.session.isAdmin = false;
    }
    res.redirect('/');
  }
);

// Cerrar sesión Google (opcional, igual que tu logoutUser)
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

export default router;
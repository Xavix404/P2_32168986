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

// Middleware para requerir autenticación
function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.session && req.session.userId) {
        return next();
    }
    res.status(403).render('login', { error: 'Debes iniciar sesión para acceder.' });
}

const router = express.Router();

router.get('/', contactControler.getALL);
router.post('/send', contactControler.validateData, contactControler.add);
// Protege la ruta admin:
router.get('/admin', requireAuth, contactControler.getContacts);
router.post('/admin/clear', requireAuth, contactControler.clearContacts);
router.get('/payment', contactControler.getPayment);
router.post('/payment', contactControler.processPayment);
router.get('/pagos', requireAuth, contactControler.getPagos);
router.post('/pagos/clear', requireAuth, contactControler.clearPagos);
router.get('/register', requireAuth, contactControler.getRegister);
router.post('/register', requireAuth, contactControler.registerUser);
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
    // Verifica que el email sea refriexpert491@gmail.com
    const email = (req.user as any)?.emails?.[0]?.value;
    if (email === 'refriexpert491@gmail.com') {
      req.session.userId = email;
      req.session.isAdmin = true;
      req.session.username = 'admin';
      return res.redirect('/admin');
    } else {
      req.logout(() => {});
      return res.render('login', { error: 'Solo el administrador puede iniciar sesión con Google.' });
    }
  }
);

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

export default router;
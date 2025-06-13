"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Controler_1 = require("../controlers/Controler");
const passport_1 = __importDefault(require("passport"));
// Middleware para proteger la ruta admin
function requireAdmin(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    res.status(403).render('login', { error: 'Acceso solo para administradores.' });
}
const router = express_1.default.Router();
router.get('/', Controler_1.contactControler.getALL);
router.post('/send', Controler_1.contactControler.validateData, Controler_1.contactControler.add);
// Protege la ruta admin:
router.get('/admin', requireAdmin, Controler_1.contactControler.getContacts);
router.post('/admin/clear', Controler_1.contactControler.clearContacts);
router.get('/payment', Controler_1.contactControler.getPayment);
router.post('/payment', Controler_1.contactControler.processPayment);
router.get('/pagos', requireAdmin, Controler_1.contactControler.getPagos);
router.post('/pagos/clear', Controler_1.contactControler.clearPagos);
router.get('/register', requireAdmin, Controler_1.contactControler.getRegister);
router.post('/register', requireAdmin, Controler_1.contactControler.registerUser);
router.get('/login', Controler_1.contactControler.getLogin);
router.post('/login', Controler_1.contactControler.loginUser);
router.get('/logout', Controler_1.contactControler.logoutUser);
router.post('/logout', Controler_1.contactControler.logoutUser);
// Iniciar login con Google
router.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
// Callback de Google
router.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    // Verifica que el email sea refriexpert491@gmail.com
    const email = req.user?.emails?.[0]?.value;
    if (email === 'refriexpert491@gmail.com') {
        req.session.userId = email;
        req.session.isAdmin = true;
        req.session.username = 'admin';
        return res.redirect('/admin');
    }
    else {
        req.logout(() => { });
        return res.render('login', { error: 'Solo el administrador puede iniciar sesión con Google.' });
    }
});
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});
exports.default = router;

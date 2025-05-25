import express from 'express';
import { contactControler } from '../controlers/Controler';
const router = express.Router();
import { adminAuth } from '../middlewares/adminAuth';

router.get('/', contactControler.getALL);
router.post('/send', contactControler.validateData, contactControler.add);
router.all('/admin', adminAuth, contactControler.getContacts);
router.get('/admin/logout', (req, res) => {
    req.session.adminAuthed = false;
    res.redirect('/admin');
});
router.post('/admin/clear', contactControler.clearContacts);
router.get('/payment', contactControler.getPayment);
router.post('/payment', contactControler.processPayment);

export default router;
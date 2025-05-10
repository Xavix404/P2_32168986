import express from 'express';
import { contactControler } from '../controlers/indexControler';
const router = express.Router();

router.get('/', contactControler.getALL);
router.post('/send', contactControler.validateData, contactControler.add);
router.get('/admin', contactControler.getContacts);
router.get('/payment', contactControler.getPayment);
router.post('/paymentSuccess', contactControler.paymentSuccess);

export default router;
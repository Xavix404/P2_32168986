import express from 'express';
import { contactControler } from '../controlers/indexControler';
const router = express.Router();

router.get('/', contactControler.getALL);
router.post('/send', contactControler.add);

export default router;
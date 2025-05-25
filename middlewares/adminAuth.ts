import { Request, Response, NextFunction } from 'express';
import session from 'express-session';

declare module 'express-session' {
    interface SessionData {
        adminAuthed?: boolean;
    }
}

export function adminAuth(req: Request, res: Response, next: NextFunction) {
    if (req.session && req.session.adminAuthed) {
        return next();
    }
    if (req.method === 'POST') {
        const { password } = req.body;
        if (password === process.env.ADMIN_PASSWORD) {
            req.session.adminAuthed = true;
            return res.redirect('/admin');
        } else {
            return res.render('adminLogin', { error: 'Contraseña incorrecta' });
        }
    }
    res.render('adminLogin', { error: null });
}
import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

// Extend express-session types to include 'lang'
declare module 'express-session' {
    interface SessionData {
        lang?: string;
    }
}

const localesDir = path.join(__dirname, '../locales');
const translations: Record<string, any> = {
    es: JSON.parse(fs.readFileSync(path.join(localesDir, 'es.json'), 'utf8')),
    en: JSON.parse(fs.readFileSync(path.join(localesDir, 'en.json'), 'utf8'))
};

export function i18nMiddleware(req: Request, res: Response, next: NextFunction) {
    let lang = req.cookies?.lang || req.session?.lang || req.acceptsLanguages('es', 'en') || 'es';
    if (req.query.lang && ['es', 'en'].includes(req.query.lang as string)) {
        lang = req.query.lang as string;
        res.cookie('lang', lang, { maxAge: 365 * 24 * 60 * 60 * 1000 });
        req.session.lang = lang;
    }
    req.session.lang = lang;
    res.locals.lang = lang;
    res.locals.t = (key: string) => translations[lang][key] || key;
    res.locals.formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        if (lang === 'es') {
            return date.toLocaleString('es-VE', { hour12: false });
        } else {
            return date.toLocaleString('en-US', { hour12: true });
        }
    };
    res.locals.formatCurrency = (amount: number, currency: string) => {
        if (lang === 'es') {
            return new Intl.NumberFormat('es-VE', { style: 'currency', currency: currency === 'VBS' ? 'VES' : currency }).format(amount);
        } else {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency === 'VBS' ? 'USD' : currency }).format(amount);
        }
    };
    next();
}
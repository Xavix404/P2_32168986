import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { ContactsModel, Contact } from "../models/Model";
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';
declare module 'express-session' {
    interface SessionData {
        userId?: number;
        username?: string;
        isAdmin?: boolean;
    }
}

export class contactControler {
    // Validaciones para los campos del formulario
    static validateData = [
        check('name')
            .matches(/^[a-zA-ZÀ-ÿ\s]{1,40}$/)
            .withMessage('El nombre es inválido'),
        check('email')
            .isEmail()
            .withMessage('El email es obligatorio'),
        check('phone')
            .matches(/^0?(412|414|416|424|426)-?\d{7}$/)
            .withMessage('El número de teléfono no es válido'),
        check('message')
            .notEmpty()
            .withMessage('El mensaje es obligatorio')
            .isLength({ max: 200 })
            .withMessage('El mensaje debe tener máximo 200 caracteres')
    ];

    // Renderiza la página principal
    static async getALL(req: Request, res: Response) {
        res.render('index', {
            title: "RefriExpert",
            ogTitle: "RefriExpert - Servicio profesional de refrigeración",
            ogDescription: "Soluciones rápidas y profesionales para tu refrigerador.",
            ogType: "website",
            ogUrl: "http://localhost:10000/",
            ogImage: "http://localhost:10000/img/og-index.jpg",
            errors: [],
            data: {},
            isLoggedIn: !!req.session.userId,
            isAdmin: req.session.isAdmin
        });
    }

    // Procesa el envío del formulario
    static async add(req: Request, res: Response) {
        try {
            // Validaciones y obtención de datos
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('index', {
                    title: "RefriExpert",
                    errors: errors.array(),
                    data: req.body,
                    isLoggedIn: !!req.session.userId,
                    isAdmin: req.session.isAdmin
                });
            }

            // Obtener datos del formulario y agregar info adicional
            const { name, email, phone, message } = req.body;
            const ip = req.ip || '';
            let country = '';
            let city = '';
            try {
                const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
                const geoData = await geoRes.json() as { country_name?: string; city?: string };
                country = geoData.country_name || '';
                city = geoData.city || '';
            } catch (e) {
                country = '';
                city = '';
            }
            const date = new Date().toLocaleString();

            const saveData: Contact = {
                name,
                email,
                phone,
                message,
                ip,
                country,
                city,
                date
            };

            await ContactsModel.saveContact(saveData);

            await contactControler.sendContactEmail(saveData, [
                //'programacion2ais@yopmail.com',
                'victormiseltrabajo@gmail.com'
            ]);

            res.render('success', { title: "RefriExpert-Success" });
        } catch (error) {
            console.error('Error al guardar el contacto:', error);
            res.status(500).render('success', { title: 'Error del servidor' });
        }
    }

    // Obtener todos los contactos
    static async getContacts(req: Request, res: Response) {
        try {
            const contacts = await ContactsModel.getContacts();
            res.render('admin', {
                contacts: contacts,
                title: "RefriExpert-Admin",
                ogTitle: "Panel de administración - RefriExpert",
                ogDescription: "Gestiona los contactos y pagos de RefriExpert.",
                ogType: "website",
                ogUrl: "http://localhost:10000/admin",
                ogImage: "http://localhost:10000/img/og-admin.jpg",
                isLoggedIn: !!req.session.userId, 
                isAdmin: req.session.isAdmin      
            });
        } catch (error) {
            res.status(500).send('Error al obtener los contactos');
            console.error('Error al obtener los contactos:', error);
        }
    }

    static async getPayment(req: Request, res: Response) {
        res.render('payment', {
            title: "RefriExpert-Payment",
            isAdmin: req.session.isAdmin
        });
    }

    static async clearContacts(req: Request, res: Response) {
        try {
            await ContactsModel.clearContacts();
            res.redirect('/admin');
        } catch (error) {
            console.error('Error al limpiar la base de datos:', error);
            res.status(500).render('500', { title: 'Error del servidor' });
        }
    }

    static async clearPagos(req: Request, res: Response) {
        try {
            await ContactsModel.clearPagos();
            res.redirect('/pagos');
        } catch (error) {
            console.error('Error al limpiar los pagos:', error);
            res.status(500).render('500', { title: 'Error del servidor' });
        }
    }

    static async processPayment(req: Request, res: Response) {
        try {
            let { cardNumber, cardHolder, expiryYear, expiryMonth, cvv, amount, currency, service } = req.body;
            cardNumber = String(cardNumber).replace(/\s+/g, '');
            const reference = '011';

            const response = await fetch('https://fakepayment.onrender.com/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZmFrZSBwYXltZW50IiwiZGF0ZSI6IjIwMjUtMDUtMjRUMjI6MjE6MjcuNDA1WiIsImlhdCI6MTc0ODEyNTI4N30.lzIXvvCCzKCLQD-qxtUFe1v7g65wOC0MzPcmoVAFlNI' },
                body: JSON.stringify({
                    amount: String(amount),
                    "card-number": cardNumber,
                    cvv: String(cvv),
                    "expiration-month": expiryMonth,
                    "expiration-year": expiryYear,
                    "full-name": cardHolder,
                    currency: String(currency),
                    description: service,
                    reference
                }, null, 2)
            });

            // console.log('Status de respuesta:', response.status);
            const text = await response.text();
            // console.log('Respuesta de la API:', text);

            let result;
            try {
                result = JSON.parse(text);
                ContactsModel.addPago(result.data.description, result.data.amount, result.data.date, result.success ? 'success' : 'error');
                // console.log('Resultado del pago:', result);
            } catch (e) {
                return res.render('payment', { title: "Pago", error: "La API de pago no respondió correctamente." });
            }

            if (result.success) {
                return res.render('paymentSuccess', { title: "Pago Exitoso" });
            } else {
                return res.render('payment', { title: "Pago", error: result.message });
            }
        } catch (error) {
            console.log('Error en el pago:', error);
            return res.render('payment', { title: "Pago", error: "Error procesando el pago." });
        }
    }

    static async processFakePayment(paymentData: any) {
        const response = await fetch('https://fakepayment.onrender.com/pay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData)
        });
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch {
            throw new Error('Respuesta inválida de la API de pago');
        }
    }

    static async sendContactEmail(data: Contact, recipients: string[]) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"RefriExpert" <${process.env.EMAIL_USER}>`,
            to: recipients.join(','),
            subject: 'Nuevo mensaje de contacto',
            html: `
                <h2>Nuevo mensaje recibido</h2>
                <ul>
                    <li><strong>Nombre:</strong> ${data.name}</li>
                    <li><strong>Correo:</strong> ${data.email}</li>
                    <li><strong>Teléfono:</strong> ${data.phone}</li>
                    <li><strong>Mensaje:</strong> ${data.message}</li>
                    <li><strong>IP:</strong> ${data.ip}</li>
                    <li><strong>País:</strong> ${data.country}</li>
                    <li><strong>Ciudad:</strong> ${data.city}</li>
                    <li><strong>Fecha/Hora:</strong> ${data.date}</li>
                </ul>
            `
        };

        await transporter.sendMail(mailOptions);
    }

    static async getRegister(req: Request, res: Response) {
        res.render('register', { title: "RefriExpert-Register", isAdmin: req.session.isAdmin });
    }

    static async registerUser(req: Request, res: Response) {
        const { username, password } = req.body;
        try {
            await ContactsModel.createUser(username, password);
            res.redirect('/login');
        } catch (error: any) {
            if (error.code === 'SQLITE_CONSTRAINT') {
                res.status(400).render('register', { error: 'El usuario ya existe.', isAdmin: req.session.isAdmin });
            } else {
                res.status(400).render('register', { error: 'Error en el registro.', isAdmin: req.session.isAdmin });
            }
        }
    }

    static async getLogin(req: Request, res: Response) {
        res.render('login', {
            title: "RefriExpert-Login",
            isAdmin: req.session.isAdmin
        });
    }

    static async loginUser(req: Request, res: Response) {
        const { username, password } = req.body;
        try {
            const user = await ContactsModel.findByUsername(username);
            if (!user) {
                return res.status(401).render('login', { error: 'Usuario o contraseña incorrectos.', isAdmin: req.session.isAdmin });
            }
            const isMatch = await ContactsModel.comparePassword(password, user.password_hash);
            if (!isMatch) {
                return res.status(401).render('login', { error: 'Usuario o contraseña incorrectos.', isAdmin: req.session.isAdmin });
            }
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.isAdmin = (user.username === 'admin' && password === 'passwordadmin');
            // Redirige según si es admin o no
            if (req.session.isAdmin) {
                res.redirect('/admin');
            } else {
                res.redirect('/');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            res.status(500).send('Error del servidor');
        }
    }

    static async logoutUser(req: Request, res: Response) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al cerrar sesión:', err);
                return res.status(500).send('Error del servidor');
            }
            res.redirect('/');
        });
    }

    static async getPagos(req: Request, res: Response) {
        try {
            const pagos = await ContactsModel.getPagos();
            res.render('pagos', {
                pagos: pagos,
                title: "RefriExpert-Pagos",
                isAdmin: req.session.isAdmin
            });
        } catch (error) {
            console.error('Error al obtener los pagos:', error);
            res.status(500).send('Error al obtener los pagos');
        }
    }

    static async getContact(req: Request, res: Response) {
        res.render('contact', {
            title: "Contáctanos - RefriExpert",
            ogTitle: "Formulario de contacto - RefriExpert",
            ogDescription: "Envíanos tu consulta o solicita tu presupuesto sin compromiso.",
            ogType: "website",
            ogUrl: "http://localhost:10000/contact",
            ogImage: "http://localhost:10000/img/og-contact.jpg",
            errors: [],
            data: {},
            isLoggedIn: !!req.session.userId,
            isAdmin: req.session.isAdmin
        });
    }

    static async pageNotFound(req: Request, res: Response) {
        res.status(404).render('404', {
            title: "404 - Página no encontrada",
            ogTitle: "404 - Página no encontrada",
            ogDescription: "La página que buscas no existe.",
            ogType: "website",
            ogUrl: "http://localhost:10000/404",
            ogImage: "http://localhost:10000/img/og-default.jpg"
        });
    }
}
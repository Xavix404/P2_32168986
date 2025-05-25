import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { ContactsModel, Contact } from "../models/Model";
import fetch from 'node-fetch';
import nodemailer from 'nodemailer';

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
            errors: [],
            data: {}
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
                    data: req.body
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
            res.render('admin', { contacts: contacts, title: "RefriExpert-Admin" });
        } catch (error) {
            res.status(500).send('Error al obtener los contactos');
            console.error('Error al obtener los contactos:', error);
        }
    }

    static async getPayment(req: Request, res: Response) {
        res.render('payment', {
            title: "RefriExpert-Payment",
        });
    }

    static async clearContacts(req: Request, res: Response) {
        try {
            await ContactsModel.clearAll();
            res.redirect('/admin'); // O renderiza un mensaje de éxito
        } catch (error) {
            console.error('Error al limpiar la base de datos:', error);
            res.status(500).render('500', { title: 'Error del servidor' });
        }
    }

    static async processPayment(req: Request, res: Response) {
        try {
            let { cardNumber, cardHolder, expiryYear, expiryMonth, cvv, amount, currency } = req.body;
            cardNumber = String(cardNumber).replace(/\s+/g, '');
            const description = 'service';
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
                    description,
                    reference
                }, null, 2)
            });

            // console.log('Status de respuesta:', response.status);
            const text = await response.text();
            // console.log('Respuesta de la API:', text);

            let result;
            try {
                result = JSON.parse(text);
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
}
import { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { ContactsModel, Contact } from "../models/contactsModel";

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
            .matches(/^0?(412|414|416|424)-?\d{7}$/)
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
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).render('index', {
                    title: "RefriExpert",
                    errors: errors.array(),
                    data: req.body
                });
            }

            const { name, email, phone, message } = req.body;
            const ip = (req.ip || 'unknown').replace('::ffff:', '');
            const now = new Date();
            const date = now.toISOString().replace('T', ' ').substring(0, 19); // YYYY-MM-DD HH:mm:ss

            const saveData: Contact = { email, name, phone, message, ip, date };
            await ContactsModel.saveContact(saveData);

            res.render('success', {
                title: "RefriExpert-Success"
            });
        } catch (error) {
            console.error('Error al guardar el contacto:', error);
            res.status(500).render('500', { title: 'Error del servidor' });
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

    static async paymentSuccess(req: Request, res: Response) {
        res.render('paymentSuccess', {
            title: "RefriExpert-Payment",
        });
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
}
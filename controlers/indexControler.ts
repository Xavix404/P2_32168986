import { Request, Response } from "express";
import {check, validationResult} from "express-validator";
import { ContactsModel } from "../models/contactsModel";

export class contactControler {
    static validateData = [
        check('name').notEmpty().withMessage('El nombre es obligatorio'),
        check('email').isEmail().withMessage('El email es obligatorio'),
        check('phone').matches(/^(0?424-?\d{7}|424-?\d{7})$/).withMessage('El numero telefono no es valido'),
        check('message').notEmpty().withMessage('El mensaje es obligatorio')
    ]

    static async getALL(req: Request, res: Response) {
        res.render('index', {
            title: "RefriExpert",
            errors: [],
            data: {}
        })
    }


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
            const date = new Date().toISOString().split('T')[0];
            const saveData = { email, name, phone, message, ip, date };

            await ContactsModel.saveContact(saveData)

            res.render('success', {
                title: "RefriExpert",
            })
        } catch (error) {
            res.status(500).send('Error al guardar el contacto');
            console.error('Error al guardar el contacto:', error);
        }
    }

    // Obtener todos los contactos

    static async getContacts(req: Request, res: Response) {
        try {
            const contacts = await ContactsModel.getContacts();
            res.render('admin', {contacts : contacts ,title: "RefriExpert-Admin"});
        } catch (error) {
            res.status(500).send('Error al obtener los contactos');
            console.error('Error al obtener los contactos:', error);
        }
    }

    static async paymentSuccess(req: Request, res: Response) {
        res.render('paymentSuccess', {
            title: "RefriExpert-Payment",
        })
    }

    static async getPayment(req: Request, res: Response) {
        res.render('payment', {
            title: "RefriExpert-Payment",
        })
    }
}
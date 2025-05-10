import { Request, Response } from "express";
import { ContactsModel } from "../models/contactsModel";

export class contactControler {
    static async getALL(req: Request, res: Response) {
        res.render('index', {
            title: "RefriExpert",
        })
    }

    static async add(req: Request, res: Response) {
        try {
        const { name, email, phone, message } = req.body;
        const ip = req.ip || 'unknown';
        const date = new Date().toISOString();
        const saveData = { email, name, phone, message, ip, date };

        await ContactsModel.saveContact(saveData)
        
            res.render('success', {
                title: "RefriExpert-Success",
            });
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
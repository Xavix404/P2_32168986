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
        
            res.status(200).send('Contacto guardado correctamente');
        } catch (error) {
            res.status(500).send('Error al guardar el contacto');
            console.error('Error al guardar el contacto:', error);
        }
    }
}
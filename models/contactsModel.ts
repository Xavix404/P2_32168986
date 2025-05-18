import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export interface Contact {
    email: string;
    name: string;
    phone: string;
    message: string;
    ip: string;
    date: string;
}

export class ContactsModel {
    private static db: Database | null = null;

    // Inicializa la conexión una sola vez
    static async initDb() {
        if (!this.db) {
            this.db = await open({
                filename: './dataBase/service-database.db',
                driver: sqlite3.Database
            });
        }
    }

    // Crea la tabla solo si no existe
    static async createTable() {
        if (!this.db) throw new Error('Database not initialized');
        await this.db.run(
            `CREATE TABLE IF NOT EXISTS contacts (
                ID INTEGER PRIMARY KEY,
                email TEXT,
                name TEXT,
                phone TEXT,
                message TEXT,
                ip TEXT,
                date TEXT
            )`
        );
    }

    // Guarda un contacto
    static async saveContact(contact: Contact) {
        if (!this.db) throw new Error('Database not initialized');
        try {
            await this.db.run(
                'INSERT INTO contacts (email, name, phone, message, ip, date) VALUES (?, ?, ?, ?, ?, ?)',
                contact.email, contact.name, contact.phone, contact.message, contact.ip, contact.date
            );
        } catch (error) {
            console.error('Error guardando contacto:', error);
            throw error;
        }
    }

    // Obtiene todos los contactos
    static async getContacts() {
        if (!this.db) throw new Error('Database not initialized');
        try {
            return await this.db.all('SELECT ID, email, name, phone, message, ip, date FROM contacts');
        } catch (error) {
            console.error('Error obteniendo contactos:', error);
            throw error;
        }
    }
}

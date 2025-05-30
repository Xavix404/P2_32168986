import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

export interface Contact {
    name: string;
    email: string;
    phone: string;
    message: string;
    ip: string;
    date: string;
    country: string;
    city: string;
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
                date TEXT,
                country TEXT,
                city TEXT
            )`
        );
    }

    // Guarda un contacto
    static async saveContact(contact: Contact) {
        if (!this.db) throw new Error('Database not initialized');
        await this.db.run(
            'INSERT INTO contacts (email, name, phone, message, ip, date, country, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            contact.email, contact.name, contact.phone, contact.message, contact.ip, contact.date, contact.country, contact.city
        );
    }

    // Obtiene todos los contactos
    static async getContacts() {
        if (!this.db) throw new Error('Database not initialized');
        try {
            return await this.db.all('SELECT ID, email, name, phone, message, ip, date, country, city FROM contacts');
        } catch (error) {
            console.error('Error obteniendo contactos:', error);
            throw error;
        }
    }

    // Elimina todos los contactos
    static async clearAll() {
        if (!this.db) throw new Error('Database not initialized');
        await this.db.run('DELETE FROM contacts');
    }
}

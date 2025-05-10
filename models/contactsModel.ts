import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export class ContactsModel {
    private static async databaseConnection() {
        return open({
            filename: './dataBase/service-database.db',
            driver: sqlite3.Database
        })
    }

    static async saveContact(contact: { email: string; name: string; phone:string; message: string; ip: string; date: string }) {
        const db = await this.databaseConnection();
        await db.run(
            'CREATE TABLE IF NOT EXISTS contacts (ID INTEGER PRIMARY KEY, email TEXT, name TEXT, phone TEXT, message TEXT, ip TEXT, date TEXT)'
        )
        await db.run(
            'INSERT INTO contacts (email, name, phone, message, ip, date) VALUES (?, ?, ?, ?, ?, ?)',
            contact.email, contact.name, contact.phone, contact.message, contact.ip, contact.date
        )
        await db.close()
    }

    static async getContacts() {
        const db = await this.databaseConnection();
        const contacts = await db.all('SELECT ID, email, name, phone, message, ip, date FROM contacts')
        return contacts;
        await db.close()
    }
}

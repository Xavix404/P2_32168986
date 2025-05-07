import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export class ContactsModel {
    private static async databaseConnection() {
        const db = await open({
            filename: './service-database.db',
            driver: sqlite3.Database
        })
        return db
    }

    static async saveContact(contact: { email: string; name: string; message: string; ip: string; date: string }) {
        const db = await this.databaseConnection();
        await db.run(
            'CREATE TABLE IF NOT EXISTS contacts (ID INTEGER PRIMARY KEY, email TEXT, name TEXT, message TEXT, ip TEXT, date TEXT)'
        )
        await db.run(
            'INSERT INTO contacts (email, name, message, ip, date) VALUES (?, ?, ?, ?, ?)',
            contact.email, contact.name, contact.message, contact.ip, contact.date
        )
        await db.close()
    }
}

const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const contactsPath = path.join(__dirname, 'db', 'contacts.json');

async function listContacts() {
    try {
        const contacts = await fs.readFile(contactsPath);
        return JSON.parse(contacts);
    } catch (error) {
        return [];
    }
}

async function getContactById(contactId) {
    const contacts = await listContacts();
    return contacts.find(contact => contact.id === contactId) ?? null;
}

async function removeContact(contactId) {
    const contacts = await listContacts();
    const contactIdx = contacts.findIndex(contact => contact.id === contactId);
    if (contactIdx < 0) return null;

    try {
        const retObj = contacts.splice(contactIdx, 1)[0];
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
        return retObj;
    } catch (error) {
        return null
    }
}

async function addContact(name, email, phone) {
    const contacts = await listContacts();
    const contact = {id: crypto.randomUUID(), name, email, phone};

    try {
        contacts.push(contact)
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
        return contact;
    } catch (error) {
        return null
    }
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact
}

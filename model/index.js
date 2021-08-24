const fs = require("fs/promises");

const path = require("path");
const { v4 } = require("uuid");

const contactsPath = path.join(__dirname, "contacts.json");

async function getAllContacts() {
  try {
    const contacts = await fs.readFile(contactsPath);
    const parseContacts = JSON.parse(contacts);
    return parseContacts;
  } catch (error) {
    console.log("ERROR", error.message);
  }
}

async function listContacts() {
  try {
    const contacts = await getAllContacts();
    console.table(contacts);
    return contacts;
  } catch (error) {
    throw error;
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await getAllContacts();
    const contact = contacts.find((item) => item.id === contactId);
    if (!contact) {
      return null;
    }
    console.table(contact);
    return contact;
  } catch (error) {
    throw error;
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await getAllContacts();
    const idx = contacts.findIndex((item) => item.id === contactId);
    if (idx === -1) {
      return null;
    }
    const newContacts = contacts.filter((item) => item.id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
    console.table(contacts[idx]);
    return contacts[idx];
  } catch (error) {
    throw error;
  }
}

async function addContact(name, email, phone) {
  try {
    const newContact = {
      id: v4(),
      name,
      email,
      phone,
    };
    const contacts = await getAllContacts();
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    console.table(contacts);
    return contacts;
  } catch (error) {
    throw error;
  }
}

const updateContacts = async (contacts) => {
  const contactsString = JSON.stringify(contacts);
  await fs.writeFile(contactsPath, contactsString);
};

const updateContact = async (id, body) => {
  try {
    const contacts = await getAllContacts();
    const idx = contacts.findIndex((item) => item.id === id);
    if (idx === -1) {
      return null;
    }
    contacts[idx] = { ...contacts[idx], ...body };
    await updateContacts(contacts);
    return contacts[idx];
  } catch (error) {
    throw error;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

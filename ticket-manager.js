const fs = require('fs');
const path = require('path');

class TicketManager {
    constructor(filePath = './tickets.json') {
        this.filePath = filePath;
        this.ensureFileExists();
    }

    ensureFileExists() {
        if (!fs.existsSync(this.filePath)) {
            this.writeData({ tickets: [], nextId: 1 });
        }
    }

    readData() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading tickets file:', error);
            return { tickets: [], nextId: 1 };
        }
    }

    writeData(data) {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error('Error writing tickets file:', error);
            return false;
        }
    }

    createTicket(ticketData) {
        const data = this.readData();
        const newTicket = {
            id: data.nextId,
            title: ticketData.title || 'Untitled Ticket',
            description: ticketData.description || '',
            status: ticketData.status || 'open',
            priority: ticketData.priority || 'medium',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        data.tickets.push(newTicket);
        data.nextId++;
        
        if (this.writeData(data)) {
            console.log('New ticket created:', newTicket);
            return newTicket;
        }
        return null;
    }

    readTickets() {
        const data = this.readData();
        console.log('All tickets:', data.tickets);
        return data.tickets;
    }

    readTicket(id) {
        const data = this.readData();
        const ticket = data.tickets.find(t => t.id === id);
        if (ticket) {
            console.log('Ticket details:', ticket);
        } else {
            console.log('Ticket not found with ID:', id);
        }
        return ticket;
    }

    updateTicket(id, updates) {
        const data = this.readData();
        const ticketIndex = data.tickets.findIndex(t => t.id === id);
        
        if (ticketIndex === -1) {
            console.log('Ticket not found with ID:', id);
            return null;
        }
        
        data.tickets[ticketIndex] = {
            ...data.tickets[ticketIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        if (this.writeData(data)) {
            console.log('Ticket updated:', data.tickets[ticketIndex]);
            return data.tickets[ticketIndex];
        }
        return null;
    }

    deleteTicket(id) {
        const data = this.readData();
        const ticketIndex = data.tickets.findIndex(t => t.id === id);
        
        if (ticketIndex === -1) {
            console.log('Ticket not found with ID:', id);
            return false;
        }
        
        const deletedTicket = data.tickets.splice(ticketIndex, 1)[0];
        
        if (this.writeData(data)) {
            console.log('Ticket deleted:', deletedTicket);
            return true;
        }
        return false;
    }
}

module.exports = TicketManager;
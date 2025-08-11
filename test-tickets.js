const TicketManager = require('./ticket-manager');

const ticketManager = new TicketManager('./tickets.json');

console.log('=== Testing Ticket CRUD Operations ===\n');

console.log('1. Creating new tickets...');
const ticket1 = ticketManager.createTicket({
    title: 'Fix login bug',
    description: 'Users cannot login with special characters in password',
    status: 'open',
    priority: 'high'
});

const ticket2 = ticketManager.createTicket({
    title: 'Add search feature',
    description: 'Implement search functionality for tickets',
    status: 'in-progress',
    priority: 'medium'
});

console.log('\n2. Reading all tickets...');
ticketManager.readTickets();

console.log('\n3. Reading specific ticket...');
ticketManager.readTicket(1);

console.log('\n4. Updating ticket...');
ticketManager.updateTicket(1, {
    status: 'resolved',
    description: 'Users cannot login with special characters in password - FIXED'
});

console.log('\n5. Reading updated ticket...');
ticketManager.readTicket(1);

console.log('\n6. Reading all tickets after update...');
ticketManager.readTickets();

console.log('\n7. Deleting ticket...');
ticketManager.deleteTicket(2);

console.log('\n8. Reading all tickets after deletion...');
ticketManager.readTickets();
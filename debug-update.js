const TicketManager = require('./ticket-manager');

const ticketManager = new TicketManager('./tickets.json');

console.log('=== Debugging Update Issue ===\n');

console.log('1. Current tickets in file:');
const currentTickets = ticketManager.readTickets();

console.log('\n2. Attempting to update ticket ID 1...');
console.log('Before update:');
const beforeUpdate = ticketManager.readTicket(1);

console.log('\nUpdating with new status and description...');
const updateResult = ticketManager.updateTicket(1, {
    status: 'closed',
    description: 'Bug has been completely resolved and tested'
});

console.log('\nAfter update:');
const afterUpdate = ticketManager.readTicket(1);

console.log('\n3. All tickets after update:');
ticketManager.readTickets();
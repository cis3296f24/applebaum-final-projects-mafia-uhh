const roles = [
    { name: 'Mafia' },
    { name: 'Citizen' },
    { name: 'Citizen' },
    { name: 'Citizen' },
    { name: 'Citizen' }
];

const roleDesc = [
    { name: 'Mafia', description: '[Objective] Eliminate all Citizens by either voting them out during the day or the night. Outnumber or match the number of Citizens to win.' },
    { name: 'Citizen', description: '[Objective] Identify the Mafia and vote them out during the day. Eliminate all Mafia to win.' }
];

module.exports = { roles, roleDesc };
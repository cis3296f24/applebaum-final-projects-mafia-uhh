// Import the functions
const { checkPlayerNameValid, generateRoles, isMafia, kickExcessPlayers } = require('./index');



// Mock players array
const players = [
  { name: 'Alice' },
  { name: 'Bob' },
];

describe('checkPlayerNameValid', () => {
  let ws;

  beforeEach(() => {
    // Mock WebSocket object
    ws = {
      send: jest.fn(),
    };
  });

  test('should reject names longer than 24 characters', () => {
    const longName = 'aaaaaaaaaaaaaaaaaaaaaaaaa';

    const result = checkPlayerNameValid(longName, players, ws);

    expect(result).toBe(false);
    expect(ws.send).toHaveBeenCalledWith(
      JSON.stringify({ type: 'invalidPlayerName', message: "Name must be less than 25 characters long, try again." })
    );
  });

  test('should reject duplicate names', () => {
    const duplicateName = 'Alice';

    const result = checkPlayerNameValid(duplicateName, players, ws);

    expect(result).toBe(false);
    expect(ws.send).toHaveBeenCalledWith(
      JSON.stringify({type: 'invalidPlayerName', message: "Name already taken, try again."})
    );

  });

  test('should accept valid, unique names', () => {
    const validName = 'Charlie'; // New name

    const result = checkPlayerNameValid(validName, players, ws);

    expect(result).toBe(true);
    expect(ws.send).toHaveBeenCalledWith(
      JSON.stringify({ type: 'validPlayerName' })
    );
  });
});


describe('generateRoles', () => {
    test('should generate the correct number of roles', () => {
        const maxPlayers = 10;
        const numMafia = 3;
        
        const roles = generateRoles(maxPlayers, numMafia);
    
        // Check the total number of roles
        expect(roles.length).toBe(maxPlayers);

    })
    test('should generate the correct number of Mafia and Citizen roles', () => {
        const maxPlayers = 8;
        const numMafia = 2;
    
        const roles = generateRoles(maxPlayers, numMafia);
    
        // Count the number of Mafia and Citizen roles
        const mafiaCount = roles.filter(role => role.name === 'Mafia').length;
        const citizenCount = roles.filter(role => role.name === 'Citizen').length;
    
        expect(mafiaCount).toBe(numMafia);
        expect(citizenCount).toBe(maxPlayers - numMafia);
    });
    test('should return roles in a randomized order', () => {
        const maxPlayers = 6;
        const numMafia = 2;
    
        const roles1 = generateRoles(maxPlayers, numMafia);
        const roles2 = generateRoles(maxPlayers, numMafia);
    
        // The roles should be randomized, so two consecutive calls shouldn't produce the same order
        expect(roles1).not.toEqual(roles2);
        
        // Ensure both lists still contain the same roles, regardless of order
        expect(roles1.sort((a, b) => a.name.localeCompare(b.name))).toEqual(
          roles2.sort((a, b) => a.name.localeCompare(b.name))
        );
    });
});



describe('isMafia', () => {
  test('should return true if the role is "Mafia"', () => {
      // Test that the function returns true for "Mafia"
      expect(isMafia("Mafia")).toBe(true);
  });

  test('should return false if the role is not "Mafia"', () => {
      // Test that the function returns false for any role other than "Mafia"
      expect(isMafia("Citizen")).toBe(false);
  });
});

describe('kickExcessPlayers', () => {
  let ws;

  
  test('should kick players if there are more than maxPlayers', () => {
    const playersKick = [
      { name: 'Alice', ws: { close: jest.fn() } },
      { name: 'Bob', ws: { close: jest.fn() } },
      { name: 'Patrick', ws: { close: jest.fn() } },
      { name: 'Spongebob', ws: { close: jest.fn() } },
    ];

    const maxPlayers = 3;

    const previousLength = playersKick.length;
    // Log initial state to debug
    console.log('Before function call:', playersKick.map(player => player.name));

    // Call the function
    kickExcessPlayers(playersKick, maxPlayers);
    
    // Log final state to debug
    console.log('After function call:', playersKick.map(player => player.name));
    expect(playersKick.length).toBe(maxPlayers);
    expect(playersKick.some(player => player.name === 'Spongebob')).toBe(false); // Last player removed
    
    // Ensure only one player was kicked
    expect(playersKick[0].ws.close).not.toHaveBeenCalled(); // No action on first player
    expect(playersKick[1].ws.close).not.toHaveBeenCalled(); // No action on second player


  })

})
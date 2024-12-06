// Import the functions
const { checkPlayerNameValid, generateRoles, isMafia, kickExcessPlayers, checkWinConditions, updateCurrentPlayersList, assignRoles } = require('./index');


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
        const maxPlayers = 100;
        const numMafia = 10;
    
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


describe('checkWinConditions', () => {
  let ws;

  
  test('should have Citizens win with citizens receiving win messages and mafia receiving lose message', () => {
    const player1 = { team: 'CITIZEN', eliminated: false, ws: { send: jest.fn() } };
    const player2 = { team: 'CITIZEN', eliminated: false, ws: { send: jest.fn() } };
    const player3 = { team: 'MAFIA', eliminated: true, ws: { send: jest.fn() } };

    const players = [player1, player2, player3];

    const gameOver = checkWinConditions(players);

    expect(player1.ws.send).toHaveBeenCalledWith(expect.stringContaining('Game Over: Citizens win! You win!'));
    expect(player2.ws.send).toHaveBeenCalledWith(expect.stringContaining('Game Over: Citizens win! You win!'));
    expect(player3.ws.send).toHaveBeenCalledWith(expect.stringContaining('Game Over: Citizens win! You lose.'));
  })

  test('should have Mafia win with citizens receiving lose messages and mafia receiving win message', () => {
    const player1 = { team: 'CITIZEN', eliminated: true, ws: { send: jest.fn() } };
    const player2 = { team: 'CITIZEN', eliminated: false, ws: { send: jest.fn() } };
    const player3 = { team: 'MAFIA', eliminated: false, ws: { send: jest.fn() } };

    const players = [player1, player2, player3];

    const gameOver = checkWinConditions(players);

    expect(player1.ws.send).toHaveBeenCalledWith(expect.stringContaining('Game Over: Mafia win! You lose.'));
    expect(player2.ws.send).toHaveBeenCalledWith(expect.stringContaining('Game Over: Mafia win! You lose.'));
    expect(player3.ws.send).toHaveBeenCalledWith(expect.stringContaining('Game Over: Mafia win! You win!'));
  })

  test('should return false because no one has won', () => {
    const player1 = { team: 'CITIZEN', eliminated: false, ws: { send: jest.fn() } };
    const player2 = { team: 'CITIZEN', eliminated: false, ws: { send: jest.fn() } };
    const player3 = { team: 'MAFIA', eliminated: false, ws: { send: jest.fn() } };

    const players = [player1, player2, player3];

    const gameOver = checkWinConditions(players);

    expect(gameOver).toBe(false);
  })
})


describe('updateCurrentPlayersList', () => {
  let ws;

  test('should send updated player list to all players', () => {
    const player1 = { name: 'Alice', ws: { send: jest.fn() } };
    const player2 = { name: 'Bob', ws: { send: jest.fn() } };
    
    const players = [player1, player2];

    updateCurrentPlayersList(players);

    const expectedMessage = JSON.stringify({
        type: 'updateCurrentPlayerList',
        currentPlayers: ['Alice', 'Bob']
    });

    expect(player1.ws.send).toHaveBeenCalledWith(expectedMessage);
    expect(player2.ws.send).toHaveBeenCalledWith(expectedMessage);
  });
})


describe('assignRoles', () => {
  let ws;

  test('assignRoles assigns roles and updates player objects', () => {
    const player1 = { name: 'Alice', role: null, team: null, ws: { send: jest.fn() } };
    const player2 = { name: 'Bob', role: null, team: null, ws: { send: jest.fn() } };
    const player3 = { name: 'Jimmy', role: null, team: null, ws: { send: jest.fn() } };
    
    const players = [player1, player2, player3];

    const sortedRoles = assignRoles(players, 3, 1);

    expect(player1.role).toBeDefined();
    expect(player2.role).toBeDefined();
    expect(player3.role).toBeDefined();

    expect(player1.role).toBe(sortedRoles[0].name);
    expect(player2.role).toBe(sortedRoles[1].name);
    expect(player3.role).toBe(sortedRoles[2].name);

    players.forEach((player, index) => {
        expect(player.ws.send).toHaveBeenCalledWith(JSON.stringify({ type: 'role', role: sortedRoles[index].name }));
    });
  });
})

const Player = require('./player');

describe('Player Class', () => {
    let player;

    beforeEach(() => {
        // Create a new Player instance before each test
        player = new Player('John', 'Citizen');
    });

    test('should initialize with the correct properties', () => {
        expect(player.name).toBe('John');
        expect(player.role).toBe('Citizen');
        expect(player.eliminated).toBe(false);
        expect(player.hasVoted).toBe(false);
        expect(player.targetVote).toBeNull();
        expect(player.ability).toBeNull();
        expect(player.team).toBeNull();
    });

    test('should set hasVoted to true and targetVote to the specified player when voteFor is called', () => {
        const targetPlayer = new Player('Jane', 'Mafia');
        player.voteFor(targetPlayer);

        expect(player.hasVoted).toBe(true);
        expect(player.targetVote).toBe(targetPlayer);
    });

    test('should reset vote properties when resetVote is called', () => {
        const targetPlayer = new Player('Jane', 'Mafia');
        player.voteFor(targetPlayer);
        player.resetVote();

        expect(player.hasVoted).toBe(false);
        expect(player.targetVote).toBeNull();
    });

    test('should set eliminated to true when eliminate is called', () => {
        player.eliminate();
        expect(player.eliminated).toBe(true);
    });

    test('should handle multiple players correctly', () => {
        const player1 = new Player('Alice', 'Healer');
        const player2 = new Player('Bob', 'Cop');

        player1.voteFor(player2);

        expect(player1.hasVoted).toBe(true);
        expect(player1.targetVote).toBe(player2);
        expect(player2.hasVoted).toBe(false);
    });
});
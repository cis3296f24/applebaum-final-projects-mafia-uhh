class Player {
    constructor(name, role) {
      this.name = name;         // stores the player's name
      this.role = role;         // stores the player's role
      this.eliminated = false;  // stores the status of the player (whether alive or dead, boolean)
      this.hasVoted = false;    // stores whether the player has voted or not (boolean)
      this.targetVote = null;   // stores the target vote of the player (default set to noone)
      this.ability = null;      // stores the role's ability tag [can be used in the future to determine nighttime phase actions]
      this.team = null;
    }
  
    voteFor(player) {
      this.hasVoted = true;     // player has voted
      this.targetVote = player; // target vote is the player specified inside voteFor()
    }
  
    resetVote() {
      this.hasVoted = false;    // player's vote is reset
      this.targetVote = null;   // target vote is set to noone
    }

    eliminate() {
        this.eliminated = true; // player's status is changed to eliminated
    }

  }
  
  module.exports = Player;
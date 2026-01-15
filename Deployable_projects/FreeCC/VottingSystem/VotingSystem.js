let poll = new Map([
  ["Liber", new Set(["Gwinyai", "Tanaka", "Nyadundu"])],
  ["Tanaka", new Set(["Hakuonwi", "Theresa", "Tinotenda"])],
  ["Hakuonwi", new Set(["Smelinkosi", "Rejoice", "Gwinyiso"])],
]);
function addOption(option) {
  if (option.length) return `Option cannot be empty`;
  if (!poll.has(option)) {
    poll.set(option, new Set());
    return `Option "${option}" added to the poll.`;
  }
  return `Option "${option}" already exists.`;
}
function vote(option, voterId) {
  if (!poll.has(option)) {
    return `Option "${option}" does not exist.`;
  }
  if (poll.has(option) && poll.get(option).has(voterId)) {
    return `Voter ${voterId} has already voted for "${option}".`;
  } else if (poll.has(option) && !poll.get(option).has(voterId)) {
    poll.get(option).add(voterId);
    return `Voter ${voterId} voted for "${option}"`;
  }
}
function displayResults() {
  let results = "Poll Results:";
  poll.forEach((value, key) => {
    results += `\n${key}: ${value.size} votes`;
  });
  return results;
}

// Get total votes cast
function getTotalVotes() {
  let total = 0;
  poll.forEach((votes) => {
    total += votes.size;
  });
  return total;
}

// Get the winner (option with most votes)
function getWinner() {
  let maxVotes = 0;
  let winner = null;
  poll.forEach((votes, option) => {
    if (votes.size > maxVotes) {
      maxVotes = votes.size;
      winner = option;
    }
  });
  return winner ? `${winner} wins with ${maxVotes} votes!` : "No votes yet";
}

// Get votes for a specific option
function getVotesForOption(option) {
  if (!poll.has(option)) {
    return `Option "${option}" does not exist.`;
  }
  return `${option}: ${poll.get(option).size} votes`;
}

// List all voters for a specific option
function getVotersForOption(option) {
  if (!poll.has(option)) {
    return `Option "${option}" does not exist.`;
  }
  const voters = Array.from(poll.get(option));
  return voters.length > 0 ? voters : `No voters for "${option}"`;
}

// Remove a vote from an option
function removeVote(option, voterId) {
  if (!poll.has(option)) {
    return `Option "${option}" does not exist.`;
  }
  if (!poll.get(option).has(voterId)) {
    return `Voter ${voterId} has not voted for "${option}".`;
  }
  poll.get(option).delete(voterId);
  return `Voter ${voterId} removed their vote from "${option}"`;
}

// Change a voter's vote from one option to another
function changeVote(oldOption, newOption, voterId) {
  if (!poll.has(oldOption)) {
    return `Option "${oldOption}" does not exist.`;
  }
  if (!poll.has(newOption)) {
    return `Option "${newOption}" does not exist.`;
  }
  if (!poll.get(oldOption).has(voterId)) {
    return `Voter ${voterId} has not voted for "${oldOption}".`;
  }
  if (poll.get(newOption).has(voterId)) {
    return `Voter ${voterId} has already voted for "${newOption}".`;
  }
  poll.get(oldOption).delete(voterId);
  poll.get(newOption).add(voterId);
  return `Voter ${voterId} changed vote from "${oldOption}" to "${newOption}"`;
}

// Get all options in the poll
function getAllOptions() {
  return Array.from(poll.keys());
}

// Remove an option from the poll
function removeOption(option) {
  if (!poll.has(option)) {
    return `Option "${option}" does not exist.`;
  }
  poll.delete(option);
  return `Option "${option}" removed from the poll.`;
}

// Reset the entire poll (clear all votes)
function resetPoll() {
  poll.forEach((votes) => {
    votes.clear();
  });
  return "Poll votes have been reset!";
}

// Get detailed results sorted by votes (descending)
function getDetailedResults() {
  const results = [];
  poll.forEach((votes, option) => {
    results.push({ option, votes: votes.size });
  });
  results.sort((a, b) => b.votes - a.votes);
  return results;
}

// Check if a voter has voted for any option
function hasVoterVoted(voterId) {
  for (let [option, voters] of poll) {
    if (voters.has(voterId)) {
      return `${voterId} has voted for "${option}"`;
    }
  }
  return `${voterId} has not voted yet`;
}

console.log(displayResults());

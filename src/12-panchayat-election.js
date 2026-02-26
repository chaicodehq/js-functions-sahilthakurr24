/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
export function createElection(candidates) {
  if (!Array.isArray(candidates)) return {};
  let votes = {};
  let registeredVoters = new Set();

  const methods = {
    registerVoter: function (voter) {
      if(typeof voter !== "object" || voter ===  null) return false;
      const {id, name, age} = voter;
      if (
        typeof id !== "string" ||
        typeof name !== "string" ||
        typeof age !== "number" ||
        age < 18
      )
        return false;

      for (const voter of registeredVoters) {
        if (voter.id === id) return false;
      }

      const newVoter = {
        id,
        name,
        age,
        hasVoted: false,
      };
  
      registeredVoters.add(newVoter);
      return true;
    },
    castVote: function (voterId, candidateId, onSuccess, onError) {
      if (
        !candidates.some((candidate) => {
          return candidate.id === candidateId;
        })
      )
        return onError("Candidate not found!!");

      const registeredVoter = [...registeredVoters].find((voter) => {
        return voter.id === voterId;
      });

      if (!registeredVoter) return onError("No voter found!!");
      if (registeredVoter.hasVoted === true) return onError("Already Voted");
      registeredVoter.hasVoted = true;
      votes[voterId] = candidateId;
      return onSuccess({ voterId, candidateId });
    },
    getResults(sortFn) {
      const voteCount = {};

      for (const voterId in votes) {
        const candidateId = votes[voterId];
        voteCount[candidateId] = (voteCount[candidateId] || 0) + 1;
      }

      let results = candidates.map((c) => ({
        id: c.id,
        name: c.name,
        party: c.party,
        votes: voteCount[c.id] || 0,
      }));

      if (typeof sortFn === "function") {
        return results.sort(sortFn);
      }

      return results.sort((a, b) => b.votes - a.votes);
    },
    getWinner: function () {
      const result = this.getResults();
      if (result.length === 0 || result[0].votes === 0) {
        return null;
      }
      return result[0];
    },
  };

  return methods;
}

export function createVoteValidator(rules) {
  if (typeof rules !== "object" || rules === null)
    return function () {
      return { valid: false, reason: "Invalid validation rules" };
    };

  return function (voterObj) {
    if (typeof voterObj !== "object" || voterObj === null)
      return { valid: false, reason: "Invalid voter object" };

    for (const feild of rules.requiredFields) {
      if (!Object.hasOwn(voterObj, feild)) {
        return { valid: false, reason: `${feild} is missing` };
      }
    }
    if (typeof voterObj.age !== "number") {
      return { valid: false, reason: "Age must be a number" };
    }
    if (voterObj.age < 18) {
      return { valid: false, reason: `Min age is ${rules.minAge}` };
    }
    return { valid: true, reason: "Allowed to vote" };
  };
}

function helper(regionTree) {
  //base case
  if (
    typeof regionTree !== "object" ||
    regionTree === null ||
    typeof regionTree.votes !== "number"
  )
    return 0;
  let result = regionTree.votes;
  if (Array.isArray(regionTree.subRegions)) {
    for (const sub of regionTree.subRegions) {
      result += helper(sub);
    }

    return result;
  }
}
export function countVotesInRegions(regionTree) {
  return helper(regionTree);
}

export function tallyPure(currentTally, candidateId) {
  if (typeof currentTally !== "object" || currentTally === null) return {};

  const clonedObj = structuredClone(currentTally);

  if (Object.hasOwn(clonedObj, candidateId)) {
    clonedObj[candidateId] = clonedObj[candidateId] + 1;
    return clonedObj;
  } else {
    clonedObj[candidateId] = 1;
    return clonedObj;
  }
}

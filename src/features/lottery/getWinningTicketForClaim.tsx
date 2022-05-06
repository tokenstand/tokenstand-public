export const getWinningTickets = (dataUser) => {
  const { round, ticket_detail, ticket_ids, ticket_status } = dataUser;

  const ticketsWithRewardBrackets = ticket_detail?.map((ticket, index) => {
    return {
      round,
      id: ticket_ids[index],
      number: ticket,
      status: ticket_status[index],
      rewardBracket: getRewardBracketByNumber(
        ticket,
        String(dataUser?.lottery_round.win_number)
      ),
    };
  });

  const allWinningTickets = ticketsWithRewardBrackets?.filter((ticket) => {
    return ticket.rewardBracket >= 0;
  });

  return allWinningTickets;
};

const getRewardBracketByNumber = (
  ticketNumber: string,
  finalNumber: string
): number => {
  // Winning numbers are evaluated right-to-left in the smart contract, so we reverse their order for validation here:
  // i.e. '1123456' should be evaluated as '6543211'
  const ticketNumAsArray = ticketNumber.split("").reverse();
  const winningNumsAsArray = finalNumber.split("").reverse();
  const matchingNumbers = [];

  // The number at index 6 in all tickets is 1 and will always match, so finish at index 5
  for (let index = 0; index < winningNumsAsArray.length - 1; index++) {
    if (ticketNumAsArray[index] !== winningNumsAsArray[index]) {
      break;
    }
    matchingNumbers.push(ticketNumAsArray[index]);
  }

  // Reward brackets refer to indexes, 0 = 1 match, 5 = 6 matches. Deduct 1 from matchingNumbers' length to get the reward bracket
  const rewardBracket = matchingNumbers.length - 1;
  return rewardBracket;
};

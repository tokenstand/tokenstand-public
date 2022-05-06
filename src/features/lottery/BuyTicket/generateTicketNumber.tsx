import { random } from "lodash";

const generateTicketNumbers = (
  numberOfTickets: number,
  minNumber = 1000000,
  maxNumber = 1999999
): number[] => {
  const generatedTicketNumbers = [];

  for (let count = 0; count < numberOfTickets; count++) {
    let randomNumber = random(minNumber, maxNumber);
    while (generatedTicketNumbers.includes(randomNumber)) {
      randomNumber = random(minNumber, maxNumber);
    }
    generatedTicketNumbers.push(randomNumber);
  }

  return generatedTicketNumbers;
};

export default generateTicketNumbers;

/**
 * Remove the '1' and reverse the digits in a lottery number retrieved from the smart contract
 */
export const parseRetrievedNumber = (number: string): string => {
  const numberAsArray = number.split("");
  numberAsArray.splice(0, 1);
  numberAsArray.reverse()
  return numberAsArray.join("");
};

// Combine the elements in a ticket into a number and add the number 1 in front
export const getTicketsForPurchase = (arrTicket) => {
  return arrTicket.map((ticket) => {
    const reversedTicket = ticket.map((num) => parseInt(num, 10)).reverse();
    reversedTicket.unshift(1);
    const ticketAsNumber = parseInt(reversedTicket.join(""), 10);
    return ticketAsNumber;
  });
};

//check same tickets in 1 purchase
export const checkDuplicate = (arrTicket) => {
 const newArr = []
 const arrDuplicate = []
 for (var i = 0; i < arrTicket.length; i++) {
  if (newArr.indexOf(arrTicket[i]) === -1) {
    newArr.push(arrTicket[i])
  }
  else{
    arrDuplicate.push(arrTicket[i])
  }
}
return arrDuplicate
}

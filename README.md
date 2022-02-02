# Escrow manager

Tradtionally, escrow payments are handled by banks or lawyers. A buyer wishing to buy an expensive item would deposit funds with an escrow manager. The manager would hold the funds as a security measure giving the seller confidence that the funds were there so they could then give the item to the buyer.

An escrow manager can be replaced by a smart contract. Any rules surrounding the exchange cannot be altered once on the blockchain. This gives both buyer and seller confidence that they won't be cheated during the exchange.

This project is a take on an escrow manager, that facilitates a private sale of an NFT.
## Criteria
___
 As I develop my solidity skills, I've been searching for different ideas on projects to make. Here is the basic criteria for this project:


```
Write an escrow Smart Contract which helps users facilitate transactions. User A should be able to deposit funds in the Smart Contract while user B should be able to withdraw the previously deposited funds from user A.

You can add a timelock-like feature where funds will be automatically sent back to the depositor after a certain number of blocks has been mined and the funds haven't been withdrawn by user B.
```
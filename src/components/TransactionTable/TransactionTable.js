import React from "react";
import {lookup, iconClasses, amountDisplay, sourceDisplay} from "../../commons/utils";
import {Container, Table, Icon} from "semantic-ui-react";


export const TransactionTable = (props) => {

  const transactions = props.transactions.map(
    (transaction, index) => <TransactionItem key={index} transaction={transaction}/>);

  return (
    <Container>
      <Table selectable>
        <thead>
        <tr>
          <th/>
          <th width="300px">Description</th>
          <th>Source</th>
          <th width="105px">Amount</th>
          <th width="105px">Balance</th>
          <th>Date</th>
        </tr>
        </thead>
        <tbody>
        {transactions}
        </tbody>
      </Table>
    </Container>
  );
};

const TransactionItem = (props) => {
  const {transaction} = props;
  const itemClass = lookup(transaction.source).in(iconClasses).orDefault('pound');
  const displayBalance = transaction.balance ? amountDisplay(transaction.balance, transaction.currency) : null;
  const displayAmount = amountDisplay(transaction.amount, transaction.currency);
  const displaySource = lookup(transaction.source).in(sourceDisplay).orDefault('Other');

  return (
    <tr>
      <td style={{textAlign: 'center'}}>
        <Icon size="large" name={itemClass} style={{textAlign: 'center'}}/>
      </td>
      <td>
        {transaction.narrative}
      </td>
      <td>
        {displaySource}
      </td>
      <td className="right-aligned">{displayAmount}</td>
      <td>{displayBalance}</td>
      <td>
        <div className="ui label">
          {new Date(transaction.created).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
          }).split(' ').join('/')}
        </div>
      </td>
    </tr>
  );
};

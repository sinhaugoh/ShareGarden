import { Container } from "react-bootstrap";
import TransactionList from "../components/transactions/TransactionList";
export default function Transactions() {
  return (
    <Container className="bg-white mt-3 py-3">
      <h2>Transactions</h2>
      <TransactionList />
    </Container>
  );
}

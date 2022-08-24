import TransactionTile from "./TransactionTile";
import { Row, Col, Accordion } from "react-bootstrap";
import useFetch from "../../hooks/useFetch";

export default function TransactionList() {
  const {
    data: transactionsData,
    isLoading,
    error,
  } = useFetch("/api/transactions/");

  //TODO: implement loading page
  if (isLoading) return <h1>loading...</h1>;

  //TODO: implement error page
  if (error) return <p>{error}</p>;

  console.log("transactionsData", transactionsData);

  // categories transactionsData
  let onGoingTransaction = [];
  let completedTransaction = [];
  for (const transaction of transactionsData) {
    if (transaction.is_completed) {
      completedTransaction.push(transaction);
    } else {
      onGoingTransaction.push(transaction);
    }
  }

  return (
    <Row>
      <Col>
        <Accordion alwaysOpen>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h4>On-going</h4>
            </Accordion.Header>
            <Accordion.Body>
              <Row lg={3} md={2} sm={1} xs={1}>
                {onGoingTransaction.map((transaction) => (
                  <Col className="mb-3">
                    <TransactionTile
                      requester={transaction.requester}
                      itemPostTitle={transaction.item_post.title}
                      note={transaction.note}
                      requestAmount={transaction.request_amount}
                    />
                  </Col>
                ))}
              </Row>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <h4>Completed</h4>
            </Accordion.Header>
            <Accordion.Body>
              <Row lg={3} md={2} sm={1} xs={1}>
                {completedTransaction.map((transaction) => (
                  <TransactionTile
                    requester={transaction.requester}
                    itemPostTitle={transaction.item_post.title}
                    note={transaction.note}
                    requestAmount={transaction.request_amount}
                  />
                ))}
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>
    </Row>
  );
}

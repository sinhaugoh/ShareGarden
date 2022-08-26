import TransactionTile from "./TransactionTile";
import { Row, Col, Accordion } from "react-bootstrap";
import useFetch from "../../hooks/useFetch";
import { useState, useEffect } from "react";
import { getCookie } from "../../utils";
import LoadingIndicator from "../shared/LoadingIndicator";

export default function TransactionList() {
  const {
    data: transactionsData,
    isLoading,
    error,
    refetchData,
  } = useFetch("/api/transactions/");
  // const [shouldRefresh, setShouldRefresh] = useState(false);

  // useEffect(() => {
  //   if (shouldRefresh) {
  //     window.location.reload();
  //   }
  // }, [shouldRefresh]);

  if (isLoading) return <LoadingIndicator />;

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

  async function handleButtonOnClick(transaction_id) {
    const response = await fetch("/api/transaction/markAsCompleted/", {
      method: "POST",
      body: JSON.stringify({
        transaction_id: transaction_id,
      }),
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      refetchData();
    }
  }

  return (
    <Row>
      <Col>
        <Accordion alwaysOpen defaultActiveKey="0">
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
                      is_completed={transaction.is_completed}
                      handleButtonOnClick={handleButtonOnClick}
                      id={transaction.id}
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
                  <Col className="mb-3">
                    <TransactionTile
                      requester={transaction.requester}
                      itemPostTitle={transaction.item_post.title}
                      note={transaction.note}
                      requestAmount={transaction.request_amount}
                      is_completed={transaction.is_completed}
                      handleButtonOnClick={handleButtonOnClick}
                      id={transaction.id}
                    />
                  </Col>
                ))}
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>
    </Row>
  );
}

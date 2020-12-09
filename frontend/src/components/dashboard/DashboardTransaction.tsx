import Link from "next/link";
import React from "react";
import { Col, Row } from "react-bootstrap";

import { DatabaseConsumer } from "../../context/DatabaseProvider";

import LongCardCell from "../utils/LongCardCell";
import Term from "../utils/Term";
import GasPrice from "../utils/GasPrice";

export default () => {
  return (
    <DatabaseConsumer>
      {(context) => (
        <Row className="transaction-card" noGutters>
          <Row className="node-card-header" noGutters>
            <img
              src="/static/images/icon-transactions.svg"
              className="node-icon"
            />
            Transactions
            <Link href="/transactions">
              <a className="transaction-view-all">View All</a>
            </Link>
          </Row>
          <Row noGutters className="transaction-card-number">
            <Col xs="12" md="4">
              <LongCardCell
                title={
                  <Term title={"24hr Total"}>
                    {"The number of transactions in the last 24 hours. "}
                    <a href={"https://docs.near.org/docs/concepts/transaction"}>
                      docs
                    </a>
                  </Term>
                }
                text={context.lastDayTxCount.toLocaleString()}
                loading={!context.lastDayTxCount}
              />
            </Col>
            <Col xs="12" md="8">
              <LongCardCell
                title={
                  <Term title={"Gas Price"}>
                    {
                      "A unit of Tgas (TerraGas) is 1*10^12 units of gas. The costs of gas are very low in terms of NEAR, which is why Tgas is more commonly used."
                    }
                    <a href={"https://docs.near.org/docs/concepts/gas"}>docs</a>
                  </Term>
                }
                text={<GasPrice gasPrice={context.latestGasPrice} />}
                loading={false}
              />
            </Col>
          </Row>
          <style jsx global>{`
            .transaction-card {
              width: 720px;
              max-width: 100%;
              box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
              border-radius: 8px;
              background: #ffffff;
              margin-bottom: 500px;
            }
            @media (max-width: 400px) {
              .transaction-card {
                width: 100%;
                border-radius: 0;
              }
              .transaction-card-chart {
                margin-top: 113px;
              }
            }
            .transaction-view-all {
              margin-left: 70%;
              text-decoration: none;
              font-weight: 600;
              font-size: 14px;
              color: #0072ce;
            }
            .transaction-card-number {
              height: 113px;
              border-bottom: 2px solid #f1f1f1;
            }
            .chart-title {
              font-weight: bold;
              font-size: 16px;
              line-height: 19px;
              color: #00272c;
              padding: 10px 24px;
              width: 100%;
              height: 40px;
            }
            .transaction-card-chart {
              height: 314px;
              width: 100%;
            }
          `}</style>
        </Row>
      )}
    </DatabaseConsumer>
  );
};
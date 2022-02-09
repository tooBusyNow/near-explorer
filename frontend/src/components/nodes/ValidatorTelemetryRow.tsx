import { FC } from "react";

import { Badge, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Trans, useTranslation } from "react-i18next";
import { useLatestBlockHeight } from "../../hooks/data";
import Term from "../utils/Term";
import Timer from "../utils/Timer";

interface Props {
  producedBlocks?: number;
  expectedBlocks?: number;
  producedChunks?: number;
  expectedChunks?: number;
  latestProducedValidatorBlock?: number;
  lastSeen?: number;
  agentName?: string;
  agentVersion?: string;
  agentBuild?: string;
}

const ValidatorTelemetryRow: FC<Props> = ({
  producedBlocks,
  expectedBlocks,
  producedChunks,
  expectedChunks,
  latestProducedValidatorBlock,
  lastSeen,
  agentName,
  agentVersion,
  agentBuild,
}) => {
  const { t } = useTranslation();
  const isTelemetryAvailable =
    Boolean(producedBlocks) ||
    Boolean(expectedBlocks) ||
    Boolean(producedChunks) ||
    Boolean(expectedChunks) ||
    Boolean(latestProducedValidatorBlock) ||
    Boolean(lastSeen) ||
    Boolean(agentName) ||
    Boolean(agentVersion) ||
    Boolean(agentBuild);

  const latestBlockHeight = useLatestBlockHeight();

  if (!isTelemetryAvailable) return null;

  return (
    <>
      <Row noGutters className="validator-nodes-content-row">
        <Col className="validator-nodes-content-cell">
          <Row noGutters>
            <Col className="validator-nodes-details-title">
              <Term
                title={t("component.nodes.ValidatorTelemetryRow.uptime.title")}
                text={t("component.nodes.ValidatorTelemetryRow.uptime.text")}
                href="https://nomicon.io/Economics/README.html#rewards-calculation"
              />
            </Col>
          </Row>
          <Row noGutters>
            <Col className="validator-nodes-text uptime">
              {producedBlocks !== undefined &&
              expectedBlocks !== undefined &&
              expectedBlocks !== 0 ? (
                <>
                  <OverlayTrigger
                    placement={"bottom"}
                    overlay={
                      <Tooltip id="produced-blocks-chunks">
                        {t(
                          "component.nodes.ValidatorTelemetryRow.produced_blocks_and_chunks",
                          {
                            num_produced_blocks: producedBlocks,
                            num_expected_blocks: expectedBlocks,
                            num_produced_chunks: producedChunks,
                            num_expected_chunks: expectedChunks,
                          }
                        )}
                      </Tooltip>
                    }
                  >
                    <span>
                      {((producedBlocks / expectedBlocks) * 100).toFixed(3)}%
                    </span>
                  </OverlayTrigger>
                </>
              ) : (
                t("common.state.not_available")
              )}
            </Col>
          </Row>
        </Col>

        <Col className="validator-nodes-content-cell">
          <Row noGutters>
            <Col className="validator-nodes-details-title">
              <Term
                title={t(
                  "component.nodes.ValidatorTelemetryRow.latest_produced_block.title"
                )}
                text={t(
                  "component.nodes.ValidatorTelemetryRow.latest_produced_block.text"
                )}
              />
            </Col>
          </Row>
          <Row noGutters>
            <Col
              className={`${
                latestBlockHeight === undefined ||
                latestProducedValidatorBlock === undefined
                  ? ""
                  : Math.abs(
                      latestProducedValidatorBlock -
                        latestBlockHeight.toNumber()
                    ) > 1000
                  ? "text-danger"
                  : Math.abs(
                      latestProducedValidatorBlock -
                        latestBlockHeight.toNumber()
                    ) > 50
                  ? "text-warning"
                  : ""
              } validator-nodes-text`}
              md={3}
            >
              {latestProducedValidatorBlock ?? t("common.state.not_available")}
            </Col>
          </Row>
        </Col>

        <Col className="validator-nodes-content-cell">
          <Row noGutters>
            <Col className="validator-nodes-details-title">
              <Term
                title={t(
                  "component.nodes.ValidatorTelemetryRow.latest_telemetry_update.title"
                )}
                text={t(
                  "component.nodes.ValidatorTelemetryRow.latest_telemetry_update.text"
                )}
              />
            </Col>
          </Row>
          <Row noGutters>
            <Col className="validator-nodes-text">
              {lastSeen ? (
                <Timer time={lastSeen} />
              ) : (
                t("common.state.not_available")
              )}
            </Col>
          </Row>
        </Col>

        <Col className="validator-nodes-content-cell">
          <Row noGutters>
            <Col className="validator-nodes-details-title">
              <Term
                title={t(
                  "component.nodes.ValidatorTelemetryRow.node_agent_name.title"
                )}
                text={
                  <Trans
                    i18nKey="component.nodes.ValidatorTelemetryRow.node_agent_name.text"
                    components={{
                      nearCoreLink: (
                        <a href="https://github.com/near/nearcore" />
                      ),
                    }}
                  />
                }
              />
            </Col>
          </Row>
          <Row noGutters>
            <Col className="validator-nodes-text">
              {agentName ? (
                <Badge variant="secondary" className="agent-name-badge">
                  {agentName}
                </Badge>
              ) : (
                t("common.state.not_available")
              )}
            </Col>
          </Row>
        </Col>

        <Col className="validator-nodes-content-cell">
          <Row noGutters>
            <Col className="validator-nodes-details-title">
              {t(
                "component.nodes.ValidatorTelemetryRow.node_agent_version_or_build.title"
              )}
            </Col>
          </Row>
          <Row noGutters>
            <Col className="validator-nodes-text">
              {agentVersion || agentBuild ? (
                <Badge variant="secondary" className="agent-name-badge">
                  {`${agentVersion ?? "-"}
                              /
                              ${agentBuild ?? "-"}
                            `}
                </Badge>
              ) : (
                t("common.state.not_available")
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default ValidatorTelemetryRow;

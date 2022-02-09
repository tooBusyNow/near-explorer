import { FC } from "react";

import Receipts from "../receipts/Receipts";
import Placeholder from "../utils/Placeholder";
import PaginationSpinner from "../utils/PaginationSpinner";

import { useTranslation } from "react-i18next";
import { Receipt } from "../../libraries/wamp/types";

interface Props {
  receiptsList?: Receipt[];
}

const ReceiptsList: FC<Props> = ({ receiptsList }) => {
  const { t } = useTranslation();
  return (
    <>
      {!receiptsList ? (
        <PaginationSpinner hidden={false} />
      ) : receiptsList.length > 0 ? (
        <Receipts receipts={receiptsList} />
      ) : (
        <Placeholder>
          {t("component.receipts.ReceiptsList.no_receipts")}
        </Placeholder>
      )}
    </>
  );
};

export default ReceiptsList;
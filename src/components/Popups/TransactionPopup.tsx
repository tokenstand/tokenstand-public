import { AlertCircle, CheckCircle } from "react-feather";

import { AutoColumn } from "../Column";
import { AutoRow } from "../Row";
import ExternalLink from "../../components/ExternalLink";
import React from "react";
import { getExplorerLink } from "../../functions/explorer";
import styled from "styled-components";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import axios from "axios";

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`;

const ContentTransaction = styled.div`
  color: ${({ theme }) => theme.primaryText2};
`;

export default function TransactionPopup({
  hash,
  success,
  summary,
}: {
  hash: string;
  success?: boolean;
  summary?: string;
}) {
  const { chainId } = useActiveWeb3React();

  const isLimitOrder = localStorage.getItem("isLimitOrder");
  isLimitOrder === "true" &&
    axios({
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_API_LIMIT_ORDER}/api/update-order-status`,
      headers: {},
      data: { txId: hash, status: success ? "success" : "reject" },
    });

  return (
    <RowNoFlex style={{ zIndex: 1000 }}>
      <div style={{ paddingRight: 16 }}>
        {success ? (
          <CheckCircle className="text-2xl text-green" />
        ) : (
          <AlertCircle className="text-2xl text-red" />
        )}
      </div>
      <AutoColumn gap="sm">
        <ContentTransaction className="font-medium">
          {`${
            summary ?? "Hash: " + hash.slice(0, 8) + "..." + hash.slice(58, 65)
          } ${success ? " successfully" : " failed"}`}
        </ContentTransaction>
        {chainId && (
          <ExternalLink
            href={getExplorerLink(chainId, hash, "transaction")}
            style={{ color: success ? "#72BF65" : "red" }}
          >
            View on explorer
          </ExternalLink>
        )}
      </AutoColumn>
    </RowNoFlex>
  );
}

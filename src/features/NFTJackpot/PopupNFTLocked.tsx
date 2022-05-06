import React from "react";
import CloseIcon from "../../components/CloseIcon";
import Modal from "../../components/Modal";
import NewTooltip from "../../components/NewTooltip";
import { ButtonClose, ContentModal, HeadModal, TitleStyle } from "./styled";

const PopupNFTLocked = ({
  isOpen,
  onDismiss,
  data,
  nftLength,
}: {
  isOpen: boolean;
  onDismiss: () => void;
  data: any;
  nftLength: any;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      maxWidth={550}
      nftLength={nftLength}
    >
      <HeadModal className="flex justify-between p-0">
        <TitleStyle className="text-lg font-bold">NFT Locked</TitleStyle>
        <CloseIcon onClick={onDismiss} />
      </HeadModal>
      <ContentModal>
        <div className="list-nft list-nft-detail">
          {data?.map((nft, index) => (
            <div className={`nft-card-locked `} key={index}>
              <div
                className="nft-avatar-image"
                style={{
                  background: `url(${
                    nft?.image_url !== ""
                      ? nft?.image_url
                      : "/images/nft-default.png"
                  }) no-repeat`,
                }}
              >
                {" "}
              </div>
              <div className="nft-info">
                <div className="nft-name">
                  <NewTooltip
                    dataTip={nft?.name !== null ? nft?.name : `#${nft?.nft_id}`}
                    dataValue={
                      nft?.name !== null ? nft?.name : `#${nft?.nft_id}`
                    }
                  ></NewTooltip>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ContentModal>
      <div className="text-center">
        <ButtonClose onClick={onDismiss}>Close</ButtonClose>
      </div>
    </Modal>
  );
};

export default PopupNFTLocked;

import React from "react";
import IDOCard from "../../components/IdoCard";
import styled from "styled-components";

const PastIdo = (props) => {
  return (
    <div>
      <GroupIDOCard>
        <IDOCard />
        <IDOCard />
      </GroupIDOCard>
    </div>
  );
};

export default PastIdo;

const GroupIDOCard = styled.div`
  @media (max-width: 767px) {
    display: grid;
    grid-template-rows: repeat(1, minmax(0, 1fr));
    grid-template-columns: repeat(1, minmax(0, 1fr));
    row-gap: 39px;
  }
  @media (min-width: 768px) {
    display: grid;
    grid-template-rows: repeat(2, minmax(0, 1fr));
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-gap: 40px 50px;
  }
`;
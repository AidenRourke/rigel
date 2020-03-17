import React, { FC } from 'react';
import styled from 'styled-components';
import { blue } from 'styles/colors';

const DataContainer = styled.div`
  color: ${blue};
  text-align: center;
  &:not(:last-of-type) {
    margin-bottom: 2rem;
  }
`;

const UserPostsData: FC = () => {
  // There will probably be an api request based on the url params to fill this up
  const mockData = [
    { name: 'POSTS', value: "6.1M" },
    { name: 'COUNTRIES', value: "134" },
    { name: 'USERS', value: "2M" },
  ];
  return (
    <div>
      {mockData.map(({ name, value }) => (
        <DataContainer>
          <h1>{value}</h1>
          <h2>{name}</h2>
        </DataContainer>
      ))}
    </div>
  );
};

export { UserPostsData };

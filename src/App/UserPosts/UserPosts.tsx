import React, {FC} from 'react';
import {RouteComponentProps} from 'react-router-dom';
import styled from 'styled-components';

import {Navbar} from 'App/Navbar';
import {UserPostsData} from './UserPostsData';
import {ListView} from './ListView';
import {GlobeView} from './GlobeView';
import { gql } from 'apollo-boost';
import {useQuery} from "@apollo/react-hooks";

const UserPostsContainer = styled.div`
  padding: 2rem 2rem 2rem 3rem;
  min-width: 0px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

interface Props extends RouteComponentProps {
  setIsAuthenticated: (value: boolean) => void;
}

const GET_POSTS = gql`
  {
    posts {
      title
      description
      createdAt
      worlds {
        title
      }
    }
  }
`;

const UserPosts: FC<Props> = props => {

  const { loading, data } = useQuery(GET_POSTS);

  console.log(data);


  return (
    <>
      <Navbar {...props}>{<UserPostsData/>}</Navbar>
      <UserPostsContainer>
        <ListView label="LIST VIEW"/>
      </UserPostsContainer>
    </>
  );
};

export {UserPosts};

import React, { FC, useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import styled from 'styled-components';
import { faArrowLeft, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { green, white, blue } from 'styles/colors';
import sidebar from 'assets/SIDEBAR.png';
import { Button, ConfirmationModal, Modal } from 'Components';
import { Film3d } from './Film3d';
import { SelectWorld } from './SelectWorld';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { FilterType } from 'Types/types';
import * as colors from 'styles/colors';
import { PostTags } from './PostTags';
import { addToQuery } from '../App';
import { UserContext } from '../../Contexts/UserContext';
import { SelectMoment } from './SelectMoment';
import {Navbar} from "../Navbar";

const PostContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  flex: 1;
  position: relative;
`;

const SideBar = styled.div`
  color: ${white};
  background-color: ${green};
  padding: 2rem 5rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  width: 20rem;
`;

const SideBarHeader = styled.div`
  display: flex;
  align-items: center;
`;

const Modu = styled.img`
  max-width: 10rem;
`;

const BackArrow = styled(FontAwesomeIcon)`
  margin-right: 1rem;
  cursor: pointer;
  &:hover {
    color: black;
  }
`;

const SideBarContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TextSection = styled.section`
  &:not(:last-child) {
    margin-bottom: 2rem;
  }
`;

const TextHeader = styled.p`
  opacity: 0.7;
`;

const TextInfoButton = styled(Button)`
  padding: 0;
  border: none;
  &:hover {
    color: ${colors.black};
  }
`;

const SideBarFooter = styled.div`
  display: flex;
`;

const ImageContainer = styled.div`
  position: absolute;
  height: 100%;
  display: flex;
  align-items: center;
  left: 23rem;
  color: ${blue};
  padding-right: 2rem;
`;

const Description = styled.div`
  margin-left: 2rem;
`;

const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      latitude
      createdAt
      city
      countryCode
      description
      frame1S3
      frame2S3
      frame3S3
      frame4S3
      tags {
        id
        name
      }
      user {
        id
        preferredUsername
      }
    }
  }
`;

const REMOVE_POST = gql`
  mutation RemovePost($postId: ID!) {
    removePost(postId: $postId) {
      post {
        id
      }
    }
  }
`;

const Post: FC<RouteComponentProps> = props => {
  const {
    history,
    location: { search },
  } = props;

  const [selected, setSelected] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const { id } = useParams();
  const { user } = useContext(UserContext);

  const { loading, data } = useQuery(GET_POST, { variables: { id } });

  const [removePost] = useMutation(REMOVE_POST);

  const handleAddFilter = (filter: FilterType) => {
    const newSearch = addToQuery(filter, search);
    history.push({ pathname: `/posts`, search: newSearch });
  };

  const handleDeletePost = async (postId: string) => {
    await removePost({ variables: { postId } });
    history.push({ pathname: `/posts`, search });
  };

  if (loading) return null;

  const renderLocation = () => {
    if (data.post.city && data.post.countryCode)
      return `${data.post.city.toUpperCase()}, ${data.post.countryCode.toUpperCase()}`;
    return 'UNKNOWN';
  };

  return (
    <>
      <Navbar {...props} />
      <PostContainer>
        <SideBar>
          {/*<SideBarHeader>*/}
            {/*<BackArrow icon={faArrowLeft} size="lg" onClick={() => history.push({ pathname: '/posts', search })} />*/}
            {/*<Modu src={sidebar} />*/}
          {/*</SideBarHeader>*/}
          <SideBarContent>
            <TextSection>
              <TextHeader>CREATED BY:</TextHeader>
              <TextInfoButton
                isText={true}
                color="white"
                onClick={() => handleAddFilter({ name: data.post.user?.preferredUsername, type: 'USER' })}
              >
                <h3>{data.post.user?.preferredUsername.toUpperCase()}</h3>
              </TextInfoButton>
            </TextSection>
            <TextSection>
              <TextHeader>LOCATION:</TextHeader>
              <h3>{renderLocation()}</h3>
            </TextSection>
            <TextSection>
              <TextHeader>FILTER:</TextHeader>
              <h3>90210</h3>
            </TextSection>
            <TextSection>
              <TextHeader>SUBMISSION DATE:</TextHeader>
              <h3>{data.post.createdAt.split('T')[0]}</h3>
            </TextSection>
            <TextSection>
              <TextHeader>TAGS:</TextHeader>
              <PostTags tags={data.post.tags} handleAddFilter={handleAddFilter} postId={data.post.id} />
            </TextSection>
          </SideBarContent>
          <SideBarFooter>
            <Button color="white" size="small" onClick={() => setIsOpen(true)}>
              ADD TO WORLD
            </Button>
            {user.isAdmin && (
              <Button color="red" size="small" onClick={() => setIsConfirming(true)}>
                <FontAwesomeIcon icon={faTrashAlt} size="lg" />
              </Button>
            )}
          </SideBarFooter>
        </SideBar>
        <ImageContainer>
          <Film3d images={[data.post.frame1S3, data.post.frame2S3, data.post.frame3S3, data.post.frame4S3]} />
          <Description>
            <h1>{data.post.title}</h1>
            <p>{data.post.description}</p>
          </Description>
        </ImageContainer>
      </PostContainer>
      <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)} title={!!selected ? 'ADD TO MOMENT' : 'SELECT WORLD'}>
        {!!selected ? (
          <SelectMoment postId={data.post.id} worldId={selected} />
        ) : (
          <SelectWorld setSelected={setSelected} />
        )}
      </Modal>
      <ConfirmationModal
        isOpen={isConfirming}
        closeModal={() => setIsConfirming(false)}
        onConfirm={() => handleDeletePost(data.post.id)}
      />
    </>
  );
};

export { Post };

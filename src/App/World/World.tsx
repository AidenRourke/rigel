import React, { FC, useState } from 'react';
import { RouteComponentProps, useParams } from 'react-router';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { PublisherType } from 'Types/types';
import axios from 'axios';

import * as colors from 'styles/colors';
import { faArrowLeft, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropzone, Button, Loading } from 'Components';
import { WorldPostsList } from './WorldPostsList';
import { GET_WORLDS } from '../Worlds/Worlds';

const WorldContainer = styled.div`
  display: flex;
  flex: 1;
  padding: 3rem 2rem;
`;

const WorldData = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 40rem;
`;

const BackArrow = styled(FontAwesomeIcon)`
  margin-bottom: 2rem;
  cursor: pointer;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
`;
const Status = styled.h4`
  color: ${colors.blue};
  span {
    opacity: 0.7;
  }
`;

const Title = styled.h1`
  cursor: pointer;
  color: ${colors.green};
`;

const TextArea = styled.textarea`
  color: ${colors.green};
  resize: none;
  border: none;
  background: none;
  font-family: inherit;
`;

const TitleTextArea = styled(TextArea)`
  box-sizing: border-box;
  font-size: 2em;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  cursor: pointer;
  overflow: auto;
  color: ${colors.green};
  flex: 1;
`;

const DescriptionTextArea = styled(TextArea)`
  font-size: 1em;
  flex: 1;
`;

const WorldInfo = styled.div`
  color: ${colors.blue};
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  margin-bottom: 2rem;
  h4 {
    margin: 0;
    opacity: 0.7;
  }
`;

const DropZones = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const DropZoneImage = styled.div<{ url: string }>`
  width: 100%;
  height: 8rem;
  background-image: url(${({ url }) => url});
  background-position: center;
`;

const DropZoneVideo = styled.video`
  width: 100%;
  height: 8rem;
`;

const DropZoneText = styled.small`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const DropZoneLoading = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const CoverImage = styled.img`
  margin: 0 2rem;
  width: 22rem;
  object-fit: cover;
`;

const Buttons = styled.div`
  display: flex;
`;

const GET_WORLD = gql`
  query GetWorld($id: ID!) {
    world(id: $id) {
      id
      title
      description
      status
      coverS3
      prerollS3
      posts {
        id
        title
        preferredUsername
        frame1S3
        position
      }
      publishers {
        id
        name
        accounts {
          id
        }
      }
    }
  }
`;

const GET_SIGNED_REQUEST = gql`
  mutation SignS3($type: String!) {
    signS3(type: $type) {
      signedRequest
      url
    }
  }
`;

const UPDATE_WORLD_IMAGE = gql`
  mutation UpdateWorldImage($worldId: ID!, $imageUrl: String!) {
    updateWorldImage(worldId: $worldId, imageUrl: $imageUrl) {
      world {
        id
        coverS3
      }
    }
  }
`;

const UPDATE_WORLD_VIDEO = gql`
  mutation UpdateWorldVideo($worldId: ID!, $videoUrl: String!) {
    updateWorldVideo(worldId: $worldId, videoUrl: $videoUrl) {
      world {
        id
        prerollS3
      }
    }
  }
`;

const REMOVE_WORLD = gql`
  mutation RemoveWorld($worldId: ID!) {
    removeWorld(worldId: $worldId) {
      world {
        id
      }
    }
  }
`;

const UPDATE_WORLD_TITLE = gql`
  mutation UpdateWorldTitle($worldId: ID!, $title: String!) {
    updateWorldTitle(worldId: $worldId, title: $title) {
      world {
        id
        title
      }
    }
  }
`;

const UPDATE_WORLD_DESCRIPTION = gql`
  mutation UpdateWorldDescription($worldId: ID!, $description: String!) {
    updateWorldDescription(worldId: $worldId, description: $description) {
      world {
        id
        description
      }
    }
  }
`;

const World: FC<RouteComponentProps> = ({ history }) => {
  const [titleEditMode, setTitleEditMode] = useState(false);
  const [descriptionEditMode, setDescriptionEditMode] = useState(false);
  const [isUpdatingWorldImage, setIsUpdatingWorldImage] = useState(false);
  const [isUpdatingWorldVideo, setIsUpdatingWorldVideo] = useState(false);

  const { id } = useParams();

  const { loading, data: worldData } = useQuery(GET_WORLD, { variables: { id } });

  const [getSignedRequest] = useMutation(GET_SIGNED_REQUEST);

  const [updateWorldTitle] = useMutation(UPDATE_WORLD_TITLE);

  const [updateWorldDescription] = useMutation(UPDATE_WORLD_DESCRIPTION);

  const [updateWorldImage] = useMutation(UPDATE_WORLD_IMAGE);

  const [updateWorldVideo] = useMutation(UPDATE_WORLD_VIDEO);

  const [removeWorld] = useMutation(REMOVE_WORLD, {
    refetchQueries: [{ query: GET_WORLDS }],
    awaitRefetchQueries: true,
  });

  const handleRemoveWorld = async (worldId: string) => {
    await removeWorld({ variables: { worldId } });
    history.push('/worlds');
  };

  const uploadToS3 = async (file: File, signedRequest: string) => {
    const options = {
      headers: {
        'Content-Type': '',
      },
    };
    await axios.put(signedRequest, file, options);
  };

  const onDrop = async (acceptedFiles: File[], isImage: boolean) => {
    if (isImage) setIsUpdatingWorldImage(true);
    else setIsUpdatingWorldVideo(true);

    const type = isImage ? 'png' : 'mp4';
    const res = await getSignedRequest({ variables: { type } });
    const {
      data: {
        signS3: { url, signedRequest },
      },
    } = res;
    await uploadToS3(acceptedFiles[0], signedRequest);

    if (isImage) {
      await updateWorldImage({ variables: { worldId: worldData.world.id, imageUrl: url } });
      setIsUpdatingWorldImage(false);
    } else {
      await updateWorldVideo({ variables: { worldId: worldData.world.id, videoUrl: url } });
      setIsUpdatingWorldVideo(false);
    }
  };

  const changeTitle = async (title: string, worldId: string, shouldUpdate: boolean) => {
    if (shouldUpdate) {
      await updateWorldTitle({
        variables: {
          worldId,
          title,
        },
      });
    }
    setTitleEditMode(false);
  };

  const changeDescription = async (description: string, worldId: string, shouldUpdate: boolean) => {
    if (shouldUpdate) {
      await updateWorldDescription({
        variables: {
          worldId,
          description,
        },
      });
    }
    setDescriptionEditMode(false);
  };

  if (loading) return null;

  const { world } = worldData;

  const renderTitle = () => {
    if (titleEditMode) {
      return (
        <TitleTextArea
          autoFocus
          onBlur={({ target: { value } }: any) => changeTitle(value, world.id, value !== world.title)}
          onFocus={(e: any) => {
            e.target.value = '';
            e.target.value = world.title;
          }}
        >
          {world.title}
        </TitleTextArea>
      );
    }
    return <Title onClick={() => setTitleEditMode(true)}>{world.title || 'CLICK TO ADD TITLE'}</Title>;
  };

  const renderDescription = () => {
    if (descriptionEditMode) {
      return (
        <DescriptionTextArea
          autoFocus
          onBlur={({ target: { value } }: any) => changeDescription(value, world.id, value !== world.description)}
          onFocus={(e: any) => {
            e.target.value = '';
            e.target.value = world.description;
          }}
        >
          {world.description}
        </DescriptionTextArea>
      );
    }
    return (
      <Description onClick={() => setDescriptionEditMode(true)}>
        {world.description || 'CLICK TO ADD DESCRIPTION'}
      </Description>
    );
  };

  return (
    <WorldContainer>
      <WorldData>
        <BackArrow
          icon={faArrowLeft}
          size="lg"
          onClick={() => history.push({ pathname: '/worlds', search: window.location.search })}
        />
        <Status>
          WORLD <span>({world.status.toUpperCase()})</span>
        </Status>
        {renderTitle()}
        {renderDescription()}
        <WorldInfo>
          <div>
            <h4>CURATORS</h4>
            <h3>
              {world.publishers.reduce((a: number, c: PublisherType) => {
                if (c.accounts) {
                  return a + c.accounts.length;
                }
              }, 0)}
            </h3>
          </div>
          <div>
            <h4>RELEASE DATE</h4>
            <h3>COMING SOON</h3>
          </div>
          <div>
            <h4>AUTHOR</h4>
            <h3>{world.publishers.map((publisher: PublisherType) => publisher.name).join(', ')}</h3>
          </div>
        </WorldInfo>
        <DropZones>
          <Dropzone onDrop={(files: File[]) => onDrop(files, false)} accept="video/mp4">
            <DropZoneVideo autoPlay loop key={world.prerollS3}>
              <source src={world.prerollS3} type="video/mp4" />
            </DropZoneVideo>
            {isUpdatingWorldVideo ? (
              <DropZoneLoading>
                <Loading>
                  <small>UPDATING</small>
                </Loading>
              </DropZoneLoading>
            ) : (
              <DropZoneText>EDIT PRE-ROLL VIDEO</DropZoneText>
            )}
          </Dropzone>
          <Dropzone onDrop={(files: File[]) => onDrop(files, true)} accept="image/png">
            <DropZoneImage url={world.coverS3} />
            {isUpdatingWorldImage ? (
              <DropZoneLoading>
                <Loading>
                  <small>UPDATING</small>
                </Loading>
              </DropZoneLoading>
            ) : (
              <DropZoneText>EDIT COVER IMAGE</DropZoneText>
            )}
          </Dropzone>
        </DropZones>
        <Buttons>
          <Button color="green" size="small">
            PUBLISH
          </Button>
          <Button color="red" size="small" onClick={() => handleRemoveWorld(world.id)}>
            <FontAwesomeIcon icon={faTrashAlt} size="lg" />
          </Button>
        </Buttons>
      </WorldData>
      <CoverImage src={world.coverS3} />
      <WorldPostsList posts={world.posts} worldId={world.id} />
    </WorldContainer>
  );
};

export { World };

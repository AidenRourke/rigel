import React, { FC } from 'react';
import { Button } from 'Components/Button';
import { PublisherType } from 'Types/types';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

interface Props {
  worldId?: string;
  publisher: PublisherType;
}

const CREATE_PUBLISHER_WORLD = gql`
  mutation CreatePublisherWorld($publisherId: ID!, $worldId: ID!) {
    createPublisherWorld(publisherId: $publisherId, worldId: $worldId) {
      world {
        id
        publishers {
          id
          name
          worlds {
            id
          }
          accounts {
            id
            user {
              id
              preferredUsername
            }
          }
        }
      }
    }
  }
`;

const REMOVE_PUBLISHER_WORLD = gql`
  mutation RemovePublisherWorld($publisherId: ID!, $worldId: ID!) {
    removePublisherWorld(publisherId: $publisherId, worldId: $worldId) {
      world {
        id
        publishers {
          id
          name
          worlds {
            id
          }
          accounts {
            id
            user {
              id
              preferredUsername
            }
          }
        }
      }
    }
  }
`;

const WorldPublisherRow: FC<Props> = ({ publisher, worldId }) => {
  const [createPublisherWorld, { loading: isCreatingPublisherWorld }] = useMutation(CREATE_PUBLISHER_WORLD, {
    variables: { worldId, publisherId: publisher.id },
  });
  const [removePublisherWorld, { loading: isRemovingPublisherWorld }] = useMutation(REMOVE_PUBLISHER_WORLD, {
    variables: { worldId, publisherId: publisher.id },
  });

  return (
    <tr>
      <td>{publisher.name}</td>
      {worldId && (
        <td>
          {publisher.worlds?.some(world => world.id === worldId) ? (
            <Button
              color="red"
              isOutlined={true}
              size="small"
              isLoading={isRemovingPublisherWorld}
              onClick={() => removePublisherWorld()}
            >
              REMOVE
            </Button>
          ) : (
            <Button
              color="blue"
              isOutlined={true}
              size="small"
              isLoading={isCreatingPublisherWorld}
              onClick={() => createPublisherWorld()}
            >
              ADD
            </Button>
          )}
        </td>
      )}
    </tr>
  );
};

export { WorldPublisherRow };

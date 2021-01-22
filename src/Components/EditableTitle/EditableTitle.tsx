import React, { FC, useState } from 'react';
import styled from 'styled-components';
import * as colors from 'styles/colors';

const Title = styled.h1`
  cursor: pointer;
  color: ${colors.green};
`;

const TitleTextInput = styled.input`
  background: none;
  color: ${colors.green};
  font-family: inherit;
  font-size: 2em;
  margin-bottom: 1rem;
`;

interface Props {
  title?: string;
  onChange: (text: string) => void;
}

const EditableTitle: FC<Props> = ({ title, onChange }) => {
  const [editMode, setEditMode] = useState<boolean>(false);

  const onBlur = async (e: any) => {
    await onChange(e.target.value);
    setEditMode(false);
  };

  if (editMode) {
    return (
      <TitleTextInput
        autoFocus
        onBlur={onBlur}
        onFocus={(e: any) => {
          e.target.value = '';
          e.target.value = title;
        }}
      />
    );
  }
  return <Title onClick={() => setEditMode(true)}>{title || 'CLICK TO ADD TITLE'}</Title>;
};

export { EditableTitle };

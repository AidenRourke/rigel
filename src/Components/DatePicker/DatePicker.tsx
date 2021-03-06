import React, { FC } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import * as colors from 'styles/colors';

const DatePickerContainer = styled.div`
  flex: 1;
  .react-datepicker-wrapper {
    width: 100%;
  }
  .modu-calendar {
    border-radius: 0;
    border: 3px solid ${colors.blue};
    font-family: inherit;
    font-size: 0.6rem;
    .react-datepicker__current-month {
      font-size: 0.8rem;
      color: ${colors.blue};
    }
    .react-datepicker__day-name {
      color: ${colors.blue};
    }
    .react-datepicker__header {
      background-color: ${colors.black};
      border-radius: 0;
      border: none;
    }
    .react-datepicker__month-container {
      background-color: ${colors.black};
    }
    .react-datepicker__day {
      color: ${colors.green};
    }
    .react-datepicker__day:hover {
      background-color: transparent;
      color: ${colors.white};
    }
    .react-datepicker__day--disabled {
      opacity: 0.2;
    }
    .react-datepicker__day--disabled:hover {
      color: ${colors.green};
    }
    .react-datepicker__navigation--next {
      border-left-color: ${colors.blue};
    }
    .react-datepicker__navigation--previous {
      border-right-color: ${colors.blue};
    }
    .react-datepicker__day--selected {
      background-color: transparent;
      color: ${colors.red};
    }
    .react-datepicker__day--keyboard-selected {
      background-color: transparent;
      color: ${colors.white};
    }
  }
`;

const DateInputButton = styled.button`
  width: 100%;
  font: inherit;
  background: none;
  color: inherit;
  cursor: pointer;
  text-align: left;
  padding: 0.5rem;
  border: 3px solid transparent;
  &:hover {
    border: 3px solid ${colors.blue};
  }
`;

interface Props {
  selected: Date;
  onChange: (date: Date) => void;
}

const DatePicker: FC<Props> = ({ selected, onChange }) => {
  const Input = (props: any) => {
    return (
      <DateInputButton onClick={() => props.onClick()}>
        <small>RELEASE DATE</small>
        <p>{props.value || 'COMING SOON'}</p>
      </DateInputButton>
    );
  };

  return (
    <DatePickerContainer>
      <ReactDatePicker
        popperPlacement="top"
        calendarClassName="modu-calendar"
        selected={selected && new Date(selected)}
        onChange={onChange}
        minDate={new Date()}
        showPopperArrow={false}
        customInput={<Input />}
        onBlur={(e: any) => e.stopPropogation()}
      />
    </DatePickerContainer>
  );
};

export { DatePicker };

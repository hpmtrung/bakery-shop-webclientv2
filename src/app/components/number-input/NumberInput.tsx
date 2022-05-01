import React from 'react';
import { styled, SvgIcon } from '@mui/material';
import {ReactComponent as DecreaseIcon} from './../../../assets/icon/decrease.svg';
import {ReactComponent as IncreaseIcon} from './../../../assets/icon/increase.svg';

const StyledCartQuantityDecrease = styled('span')`
  display: inline-block;
  border-right: 1px solid rgb(200, 200, 200);
  color: rgb(153, 153, 153);
  cursor: pointer;
  width: 24px;
  height: 24px;
`;

const StyledCartQuantityIncrease = styled('span')`
  display: inline-block;
  border-right: none;
  border-left: 1px solid rgb(200, 200, 200);
  color: rgb(153, 153, 153);
  cursor: pointer;
  width: 24px;
  height: 24px;
`;

const StyledNumberInput = styled('div')`
  display: inline-flex;
  flex-wrap: nowrap;
  border: 1px solid rgb(200, 200, 200);
  border-radius: 3px;
  width: 84px;
  font-size: 14px;
  list-style: none;
  box-sizing: border-box;
`;

const StyledInput = styled('input')`
  border: none;
  background: transparent;
  width: 32px;
  text-align: center;
  font-size: 13px;
  appearance: none;
  margin: 0;
  outline: none;
  overflow: visible;
  line-height: 1.15;
  padding: 1px 2px;
`;

const NumberInput = ({ value, handleDecrease, handleIncrease }) => {
  return (
    <StyledNumberInput>
      <StyledCartQuantityDecrease onClick={handleDecrease}>
        <SvgIcon component={DecreaseIcon} color="primary" inheritViewBox sx={{ display: 'block', maxWidth: '100%' }} />
      </StyledCartQuantityDecrease>
      <StyledInput type="tel" value={value} readOnly />
      <StyledCartQuantityIncrease onClick={handleIncrease}>
        <SvgIcon component={IncreaseIcon} color="primary" inheritViewBox sx={{ display: 'block', maxWidth: '100%' }} />
      </StyledCartQuantityIncrease>
    </StyledNumberInput>
  );
};

export default NumberInput;

import { createSlice } from '@reduxjs/toolkit';

export type HeaderStateProps = {
  btnIconColor: 'white' | 'text.secondary';
  elevationEffect: boolean;
};

const initialState: HeaderStateProps = {
  btnIconColor: 'text.secondary',
  elevationEffect: false,
};

export const HeaderSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    // setBtnIconColor(state, action) {
    //   state.btnIconColor = action.payload.trigger ? 'text.secondary' : 'white';
    // },
    setHeaderElevationEffect(state, action) {
      state.elevationEffect = action.payload;
      // if (!state.elevationEffect) {
      // state.btnIconColor = 'text.secondary';
      // }
    },
  },
});

// export const { setBtnIconColor, setHeaderElevationEffect } = HeaderSlice.actions;
export const { setHeaderElevationEffect } = HeaderSlice.actions;

// reducer

export default HeaderSlice.reducer;

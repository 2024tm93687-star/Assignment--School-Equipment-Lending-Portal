import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Equipment {
  id: number;
  name: string;
  category: string;
  condition: string;
  available: boolean;
}

interface EquipmentState {
  items: Equipment[];
}

const initialState: EquipmentState = {
  items: [],
};

const equipmentSlice = createSlice({
  name: "equipment",
  initialState,
  reducers: {
    setEquipment: (state, action: PayloadAction<Equipment[]>) => {
      state.items = action.payload;
    },
    addEquipment: (state, action: PayloadAction<Equipment>) => {
      state.items.push(action.payload);
    },
  },
});

export const { setEquipment, addEquipment } = equipmentSlice.actions;
export default equipmentSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import type { Equipment } from "./types";
import {
  fetchEquipments,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from "./equipment-thunks";

interface EquipmentState {
  items: Equipment[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

const initialState: EquipmentState = {
  items: [],
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 5,
};

const equipmentSlice = createSlice({
  name: "equipment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch equipment
    builder
      .addCase(fetchEquipments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEquipments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.total = Array.isArray(action.payload) ? action.payload.length : 0;
      })
      .addCase(fetchEquipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch equipment list";
      });

    // Add equipment
    builder
      .addCase(createEquipment.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createEquipment.rejected, (state, action) => {
        state.error = action.error.message || "Failed to create equipment";
      });

    // Update equipment
    builder
      .addCase(updateEquipment.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateEquipment.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update equipment";
      });

    // Delete equipment
    builder
      .addCase(deleteEquipment.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.payload._id
        );
        state.error = null;
      })
      .addCase(deleteEquipment.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete equipment";
      });
  },
});

export default equipmentSlice.reducer;

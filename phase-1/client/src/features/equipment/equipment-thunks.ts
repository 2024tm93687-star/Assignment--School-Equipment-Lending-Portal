import { createAsyncThunk } from "@reduxjs/toolkit";
import type { EquipmentPayload } from "./types";
import { apiFetch } from "../../utils/api";
import { EQUIPMENT_SERVICE_URL } from "../../utils/api-constants";

const handleThunkError = (error: unknown, defaultMessage: string) => {
  console.error("Thunk Error:", error);
  if (error instanceof Error) {
    if (error.message.includes("Authentication failed")) {
      return `Please log in again. ${error.message}`;
    }
    return error.message;
  }
  return defaultMessage;
};

// Fetch all equipment
export const fetchEquipments = createAsyncThunk(
  "equipment/fetchEquipments",
  async (_args: void, { rejectWithValue }) => {
    try {
      const response = await apiFetch(`${EQUIPMENT_SERVICE_URL}?limit=1000000`);

      if (!response || !Array.isArray(response.items)) {
        throw new Error("Invalid response format from equipment service");
      }

      return response.items;
    } catch (error) {
      return rejectWithValue(
        handleThunkError(error, "Failed to fetch equipment list")
      );
    }
  }
);

// Create equipment
export const createEquipment = createAsyncThunk(
  "equipment/createEquipment",
  async (equipmentData: EquipmentPayload, { rejectWithValue }) => {
    try {
      if (!equipmentData.name || !equipmentData.category) {
        throw new Error("Name and category are required");
      }

      const response = await apiFetch(`${EQUIPMENT_SERVICE_URL}`, {
        method: "POST",
        body: JSON.stringify(equipmentData),
      });

      return response;
    } catch (error) {
      return rejectWithValue(
        handleThunkError(error, "Failed to create equipment")
      );
    }
  }
);

// Update equipment
export const updateEquipment = createAsyncThunk(
  "equipment/updateEquipment",
  async (
    { id, equipment }: { id: string; equipment: EquipmentPayload },
    { rejectWithValue }
  ) => {
    try {
      if (!id) throw new Error("Valid equipment ID is required");

      const response = await apiFetch(`${EQUIPMENT_SERVICE_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(equipment),
      });

      return response;
    } catch (error) {
      return rejectWithValue(
        handleThunkError(error, "Failed to update equipment")
      );
    }
  }
);

// Delete equipment
export const deleteEquipment = createAsyncThunk(
  "equipment/deleteEquipment",
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id) throw new Error("Valid equipment ID is required");

      await apiFetch(`${EQUIPMENT_SERVICE_URL}/${id}`, {
        method: "DELETE",
      });

      return { _id: id };
    } catch (error) {
      return rejectWithValue(
        handleThunkError(error, "Failed to delete equipment")
      );
    }
  }
);

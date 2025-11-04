export interface Equipment {
  _id: string; // MongoDB id
  name: string;
  category: string;
  condition: EquipmentCondition;
  quantity: number;
  available: number;
  createdAt?: string;
  updatedAt?: string;
}

export type EquipmentCondition =
  | "new"
  | "good"
  | "fair"
  | "poor"
  | "damaged"
  | "retired";

export interface EquipmentPayload {
  name: string;
  category: string;
  condition: EquipmentCondition;
  quantity: number;
  available: number;
}

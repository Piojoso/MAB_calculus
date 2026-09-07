import type { DraftClientData } from "./DraftQuote.interface";
import type { RepairPart } from "./RepairPart.interface";

export interface RepairQuote {
  id: number;
  date: string;
  clientData: DraftClientData;
  repairParts: RepairPart[];
  advance: number;
  labor: number;
  warranty: number;
  shared: boolean;
}

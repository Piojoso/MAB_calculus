import type { DraftClientData, Row } from "./index";

export type RepairQuoteStatus = "new" | "saved" | "shared";

export interface RepairQuote {
  id: number;
  date: string;
  clientData: DraftClientData;
  repairRows: Row[];
  advance: number;
  labor: number;
  warranty: number;
  shared: boolean;
  status: RepairQuoteStatus;
}

export type DraftClientData = { name: string; address: string; phone: string };
export type DraftPartData = { partId: number | null; price: number };

export interface DraftQuote {
  id: number;
  clientData: DraftClientData;
  parts: DraftPartData[];
  labor: number;
  advance: number;
  updatedAt: number;
}

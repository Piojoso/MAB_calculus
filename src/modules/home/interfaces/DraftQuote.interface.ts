export type ClientData = { name: string; address: string; phone: string };
export type PartData = { partId: number | null; price: number };

export interface DraftQuote {
  id: number;
  clientData: ClientData;
  parts: PartData[];
  labor: number;
  advance: number;
  updatedAt: number;
}

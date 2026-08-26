export interface DraftQuote {
  id: number;
  parts: { partId: number | null; price: number }[];
  labor: number;
  advance: number;
  updatedAt: number;
}

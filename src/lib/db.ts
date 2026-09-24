import type {
  DraftClientData,
  DraftQuote,
  DraftPartData,
  RepairPart,
  RepairQuote,
  RepairQuoteStatus,
  Row,
} from "@/modules/home/interfaces";
import { Dexie, type EntityTable } from "dexie";

export const db = new Dexie("Mab_Quotes_DB") as Dexie & {
  parts: EntityTable<RepairPart, "id">;
  draft: EntityTable<DraftQuote, "id">;
  historic: EntityTable<RepairQuote, "id">;
};

db.version(1).stores({
  parts: "++id, name",
  draft: "++id",
  historic: "++id, date",
});

/** Repair Quote */
export async function getRepairQuotes(): Promise<RepairQuote[]> {
  return await db.historic.orderBy("date").reverse().toArray();
}

export async function getRepairQuoteById(
  id: number,
): Promise<RepairQuote | undefined> {
  return await db.historic.get(id);
}

export async function saveRepairQuote(
  date: string,
  clientData: DraftClientData,
  repairRows: Row[],
  advance: number,
  labor: number,
  total: number,
  warranty: number,
  status: RepairQuoteStatus,
): Promise<RepairQuote> {
  const id = await db.historic.add({
    date,
    clientData,
    repairRows,
    advance,
    labor,
    total,
    warranty,
    status,
  });

  return {
    id: id as number,
    date,
    clientData,
    repairRows,
    advance,
    labor,
    total,
    warranty,
    status,
  };
}

export async function updateRepairQuote(
  id: number,
  repairPart: Partial<RepairQuote>,
): Promise<RepairQuote | undefined> {
  const updated = await db.historic.update(id, repairPart);

  if (updated) {
    return await getRepairQuoteById(id);
  }

  return;
}

/** Repair Parts */
export async function getParts(): Promise<RepairPart[]> {
  return await db.parts.orderBy("name").toArray();
}

export async function addPart(
  name: string,
  defaultPrice: number,
): Promise<RepairPart> {
  const id = await db.parts.add({ name, defaultPrice });
  return { id: id as number, name, defaultPrice };
}

export async function deletePart(id: number): Promise<void> {
  await db.parts.delete(id);
}

/** Draft */
const DRAFT_ID = 1;

export async function getDraft(): Promise<DraftQuote | undefined> {
  return await db.draft.get(DRAFT_ID);
}

export async function saveDraft(
  clientData: DraftClientData,
  parts: DraftPartData[],
  labor: number,
  advance: number,
): Promise<void> {
  const existing = await db.draft.get(DRAFT_ID);

  const draftBody = {
    clientData,
    parts,
    labor,
    advance,
    updatedAt: Date.now(),
  };

  if (existing) {
    await db.draft.update(DRAFT_ID, draftBody);
  } else {
    await db.draft.add({ id: DRAFT_ID, ...draftBody });
  }
}

export async function clearDraft(): Promise<void> {
  await db.draft.delete(DRAFT_ID);
}

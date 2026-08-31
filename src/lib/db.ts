import type {
  ClientData,
  DraftQuote,
  PartData,
  RepairPart,
} from "@/modules/home/interfaces";
import type { Dexie, EntityTable } from "dexie";

type RepairQuoteDb = Dexie & {
  parts: EntityTable<RepairPart, "id">;
  draft: EntityTable<DraftQuote, "id">;
};

let dbPromise: Promise<RepairQuoteDb> | null = null;

async function getDb(): Promise<RepairQuoteDb> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const { Dexie } = await import("dexie");
      const db = new Dexie("PresupuestosDB") as RepairQuoteDb;
      db.version(1).stores({
        parts: "++id, name",
        draft: "++id",
      });
      return db;
    })();
  }
  return dbPromise;
}

export async function getParts(): Promise<RepairPart[]> {
  const db = await getDb();
  return await db.parts.orderBy("name").toArray();
}

export async function addPart(
  name: string,
  defaultPrice: number,
): Promise<RepairPart> {
  const db = await getDb();
  const id = await db.parts.add({ name, defaultPrice });
  return { id: id as number, name, defaultPrice };
}

export async function deletePart(id: number): Promise<void> {
  const db = await getDb();
  await db.parts.delete(id);
}

const DRAFT_ID = 1;

export async function getDraft(): Promise<DraftQuote | undefined> {
  const db = await getDb();
  return await db.draft.get(DRAFT_ID);
}

export async function saveDraft(
  clientData: ClientData,
  parts: PartData[],
  labor: number,
  advance: number,
): Promise<void> {
  const db = await getDb();
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
  const db = await getDb();
  await db.draft.delete(DRAFT_ID);
}

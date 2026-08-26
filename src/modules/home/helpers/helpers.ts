import type { Row } from "../interfaces";

export function formatMoney(value: number): string {
  return `$ ${Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)}`;
}

export function todayLabel(): string {
  return new Date().toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function emptyRow(): Row {
  return { id: Math.random().toString(36).slice(2), partId: null, price: 0 };
}

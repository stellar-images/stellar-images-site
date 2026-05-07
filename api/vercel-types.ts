import type { IncomingHttpHeaders } from "node:http";

export type VercelRequest = {
  method?: string;
  headers: IncomingHttpHeaders;
  query: Record<string, string | string[] | undefined>;
  body?: unknown;
};

export type VercelResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): VercelResponse;
  json(body: unknown): void;
  send(body: string): void;
  redirect(url: string): void;
};

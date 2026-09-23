import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { SolveRequest } from "@/lib/solver";

export type MemoryTurn = {
  role: "user" | "tutor";
  text: string;
  topicId?: string;
  solve?: SolveRequest;
};

type Conversation = {
  id: string;
  grade: number;
  turns: MemoryTurn[];
};

type Store = Record<string, Conversation>;

const filePath = path.join(process.cwd(), "data", "conversations.json");

async function readStore(): Promise<Store> {
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as Store;
  } catch {
    return {};
  }
}

export async function readConversation(id: string): Promise<Conversation | null> {
  const store = await readStore();
  return store[id] ?? null;
}

export async function saveConversation(conversation: Conversation) {
  const store = await readStore();
  conversation.turns = conversation.turns.slice(-12);
  store[conversation.id] = conversation;
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(store));
}

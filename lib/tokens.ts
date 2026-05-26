import { customAlphabet } from "nanoid";

// Alphabet sans caractères ambigus (pas de 0/O/I/l) pour des tokens lisibles s'ils sont copiés à la main.
const alphabet = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const nano = customAlphabet(alphabet, 24);

export function generateInviteToken(): string {
  return nano();
}

export function generatePropositionToken(): string {
  return nano();
}

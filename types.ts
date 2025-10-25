
export type Role = "user" | "model";

export interface Message {
  role: Role;
  text: string;
  image?: string; // base64 encoded image for display
}

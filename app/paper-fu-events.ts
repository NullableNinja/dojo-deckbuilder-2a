export const PAPER_FU_TOAST_EVENT = "paper-fu-toast";

export type PaperFuToastDetail = {
  kind?: "note" | "success" | "warning" | "stamp" | "critical";
  eyebrow?: string;
  title: string;
  message?: string;
  duration?: number;
  variant?: number;
};

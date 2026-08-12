import { clsx, type ClassValue } from "clsx";

function mergeClassNames(...classes: Array<string | undefined | null | false>) {
  const merged = new Set<string>();

  for (const value of classes) {
    if (!value) continue;

    for (const className of String(value).split(/\s+/).filter(Boolean)) {
      merged.add(className);
    }
  }

  return Array.from(merged).join(" ");
}

export function cn(...inputs: ClassValue[]) {
  return mergeClassNames(clsx(inputs));
}

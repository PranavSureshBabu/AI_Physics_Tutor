import { middleFurther } from "./further-middle";
import { primaryFurther } from "./further-primary";
import { secondaryFurther } from "./further-secondary";
import { seniorFurther } from "./further-senior";

const further: Record<string, string[]> = {
  ...primaryFurther,
  ...middleFurther,
  ...secondaryFurther,
  ...seniorFurther,
};

export function furtherFor(id: string): string[] {
  return further[id] ?? [];
}

import { UseGuards } from "@nestjs/common";
import { GroupGuard } from "@guards/group.guard";

export const Groups = (...groups: string[]) => UseGuards(new GroupGuard(groups));

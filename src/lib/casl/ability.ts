import { AbilityBuilder, PureAbility } from "@casl/ability";

export enum EAction {
  MANAGE = "manage",
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  APPROVE = "approve",
}

export type ESubject =
  | "Job"
  | "Company"
  | "Resume"
  | "User"
  | "Role"
  | "CvProfile"
  | "Subscriber"
  | "Chat"
  | "File"
  | "Notification"
  | "Statistic"
  | "all";

export type AppAbility = PureAbility<[EAction, ESubject]>;

export function defineAbilityFor(roleName?: string): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(PureAbility);

  switch (roleName) {
    case "SUPER ADMIN":
      can(EAction.MANAGE, "all");
      break;

    case "HR":
      can(EAction.CREATE, "Job");
      can(EAction.READ, "Job");
      can(EAction.UPDATE, "Job");
      can(EAction.DELETE, "Job");

      can(EAction.READ, "Company");
      can(EAction.UPDATE, "Company");

      can(EAction.READ, "Resume");
      can(EAction.UPDATE, "Resume");

      can(EAction.MANAGE, "Chat");
      can(EAction.MANAGE, "CvProfile");
      can(EAction.MANAGE, "Subscriber");
      can(EAction.MANAGE, "Notification");
      can(EAction.MANAGE, "File");

      can(EAction.READ, "Statistic");
      break;

    case "NORMAL USER":
      can(EAction.READ, "Job");
      can(EAction.READ, "Company");

      can(EAction.CREATE, "Resume");
      can(EAction.READ, "Resume");

      can(EAction.MANAGE, "CvProfile");
      can(EAction.MANAGE, "Chat");
      can(EAction.MANAGE, "Subscriber");
      can(EAction.MANAGE, "Notification");
      can(EAction.MANAGE, "File");
      break;

    default:
      break;
  }

  return build();
}

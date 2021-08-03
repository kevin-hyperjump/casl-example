import { Ability, AbilityBuilder } from "@casl/ability";
import { PrismaClient, Role, User } from "@prisma/client";

const prisma = new PrismaClient();

export const defineUserAbilityFor = async (id?: string) => {
  const { can, build } = new AbilityBuilder(Ability);

  const user = await prisma.user.findUnique({ where: { id } });

  switch (user?.role) {
    case Role.ADMIN:
      can("update", "User");
      can("delete", "User");
      break;
    default:
      can("update", "User", { id: user?.id });
      can("delete", "User", { id: user?.id });
      break;
  }

  return build();
};

export const definePostManyAbilityFor = (user: User | null) => {
  const { can, build } = new AbilityBuilder(Ability);

  switch (user?.role) {
    case Role.ADMIN:
      can("read", "Post");
      break;
    default:
      can("read", "Post", { private: false });
      break;
  }

  return build();
};

export const definePostOneAbilityFor = async ({
  id,
  role,
}: {
  id: string;
  role?: Role;
}) => {
  const { can, build } = new AbilityBuilder(Ability);

  const post = await prisma.post.findUnique({ where: { id } });

  switch (role) {
    case Role.ADMIN:
      can("read", "Post");
      can("update", "Post");
      can("delete", "Post");
      break;
    default:
      can("read", "Post", { private: post?.private, userID: post?.userID });
      can("update", "Post", { userID: post?.userID });
      can("delete", "Post", { userID: post?.userID });
      break;
  }

  return build();
};

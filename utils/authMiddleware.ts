import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const authMiddleware = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.headers.authorization?.toString();

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    res.status(404).json({ message: "User Not Found" });

    return user;
  }

  return user;
};

export default authMiddleware;

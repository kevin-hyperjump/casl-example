import { NextApiRequest, NextApiResponse } from "next";

import { accessibleBy } from "@casl/prisma";
import { PrismaClient } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      await handlePOST(req, res);
      break;
    case "GET":
      await handleGET(req, res);
      break;
    default:
      res.status(404);
      break;
  }
}

const prisma = new PrismaClient();

const handlePOST = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;

  try {
    const user = await prisma.user.create({ data: body });

    res.status(201).send(user);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

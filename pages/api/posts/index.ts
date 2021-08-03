import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
import { accessibleBy } from "@casl/prisma";
import {
  definePostOneAbilityFor,
  definePostManyAbilityFor,
} from "../../../utils/abillity";
import authMiddleware from "../../../utils/authMiddleware";

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
    const post = await prisma.post.create({ data: body });

    res.status(201).send(post);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const userAuth = await authMiddleware(req, res);

    const posts = await prisma.post.findMany({
      where: accessibleBy(definePostManyAbilityFor(userAuth)).Post,
    });

    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

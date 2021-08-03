import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
import { definePostOneAbilityFor } from "../../../utils/abillity";
import { subject } from "@casl/ability";
import authMiddleware from "../../../utils/authMiddleware";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      handleGET(req, res);
      break;
    case "PUT":
      handlePUT(req, res);
      break;
    case "DELETE":
      handleDELETE(req, res);
      break;
    default:
      res.status(404);
      break;
  }
}

const prisma = new PrismaClient();

const handleGET = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id.toString();

  try {
    const post = await prisma.post.findUnique({ where: { id } });

    res.status(200).send(post);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const postID = req.query.id.toString();

  try {
    const userAuth = await authMiddleware(req, res);
    const postAbilityDefined = await definePostOneAbilityFor({
      id: postID,
      role: userAuth?.role,
    });

    const isAccessible = postAbilityDefined.can(
      "update",
      subject("Post", { id: postID })
    );

    if (isAccessible) {
      const post = await prisma.post.update({
        where: { id: postID },
        data: req.body,
      });

      res.status(200).send(post);
    } else {
      res.status(403).send({ message: "Forbidden" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const postID = req.query.id.toString();

  try {
    const userAuth = await authMiddleware(req, res);
    const postAbilityDefined = await definePostOneAbilityFor({
      id: postID,
      role: userAuth?.role,
    });

    const isAccessible = postAbilityDefined.can(
      "update",
      subject("Post", { id: postID })
    );

    if (isAccessible) {
      const post = await prisma.post.delete({ where: { id: postID } });

      res.status(200).send(post);
    } else {
      res.status(403).send({ message: "Forbidden" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

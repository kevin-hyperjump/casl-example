import { NextApiRequest, NextApiResponse } from "next";

import { subject } from "@casl/ability";
import { PrismaClient } from "@prisma/client";

import { defineUserAbilityFor } from "../../../utils/abillity";

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
    const user = await prisma.user.findUnique({ where: { id } });

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id.toString();
  const authID = req.headers.authorization?.toString();

  try {
    const userAbilityDefined = await defineUserAbilityFor(authID);
    const userSubject = subject("User", { id });
    const isAccessible = userAbilityDefined.can("update", userSubject);

    if (isAccessible) {
      const user = await prisma.user.update({
        where: { id },
        data: req.body,
      });

      res.status(200).send(user);
    } else {
      res.status(403).send({ message: "Forbidden" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const handleDELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id.toString();
  const authID = req.headers.authorization?.toString();

  try {
    const userAbilityDefined = await defineUserAbilityFor(authID);
    const userSubject = subject("User", { id });
    const isAccessible = userAbilityDefined.can("update", userSubject);

    if (isAccessible) {
      const user = await prisma.user.delete({ where: { id } });

      res.status(200).send(user);
    } else {
      res.status(403).send({ message: "Forbidden" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

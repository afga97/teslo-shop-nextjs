import jwt from "jsonwebtoken";
import { Types } from 'mongoose';

export const signToken = (_id: Types.ObjectId, email: string) => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error("No hay una semilla de jwt, validar envs");
  }

  return jwt.sign({ _id, email }, process.env.JWT_SECRET_SEED, {
    expiresIn: "30d",
  });
};

export const isValidToken = (token: string): Promise<string> => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error("No hay semilla de JWT - Revisar variables de entorno");
  }

  if (token.length <= 10) {
    return Promise.reject("JWT no es válido");
  }

  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.JWT_SECRET_SEED || "", (err, payload) => {
        if (err) return reject("JWT no es válido");
        const { _id } = payload as { _id: string };
        resolve(_id);
      });
    } catch (error) {
      reject("JWT no es válido");
    }
  });
};

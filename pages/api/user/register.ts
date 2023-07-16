import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import { db } from "../../../database";
import { User } from "../../../models";
import { jwt, validations } from "../../../utils";

type Data = 
| { message: string; }
| { 
    token: string;
    user: {
      email: string;
      name: string;
      role: string
    }
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return registerUser(req, res);

    default:
      res.status(400).json({
        message: "Bad request",
      });
  }

  res.status(200).json({ message: "Example" });
}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { name = "", email = "", password = "" } = req.body;

  if (password.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe contener 6 caracteres o más' })
  }

  if (name.length < 2) {
    return res.status(400).json({ message: 'El nombre debe contener 3 caracteres o más' })
  }

  if (!validations.isValidEmail(email)) {
    return res.status(400).json({ message: 'El correo no tiene formato válido' })
  }

  await db.connect();
  const user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({
      message: 'El correo ya se encuentra en uso'
    })
  }

  const newUser = new User({
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password),
    role: 'client',
    name
  })
  try {
    await newUser.save()
    await db.disconnect()
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: 'Ocurrio un error al registrar al usuario'
    })
  }

  const { _id, role, name: nameUser } = newUser;

  const token = jwt.signToken(_id as unknown as Types.ObjectId, email)

  res.status(200).json({
    token,
    user: {
      email, role, name: nameUser
    }
  })

};

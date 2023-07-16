import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import { db } from "../../../database";
import { User } from "../../../models";
import { jwt } from "../../../utils";
import { IUser } from "../../../interfaces";

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
      return loginUser(req, res);

    default:
      res.status(400).json({
        message: "Bad request",
      });
  }

  res.status(200).json({ message: "Example" });
}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email = "", password = "" } = req.body;

  await db.connect();
  const user = await User.findOne({ email });
  await db.disconnect()

  if (!user){
    return res.status(400).json({
      message: 'Correo o contraseña no válidos'
    })
  }

  if ( !bcrypt.compareSync( password, user.password! ) ) {
    return res.status(400).json({ message: 'Correo o contraseña no válidos' })
  }
  const { _id, role, name }  = user;

  const token = jwt.signToken(_id as unknown as Types.ObjectId, email)

  res.status(200).json({
    token,
    user: {
      email, role, name
    }
  })

};

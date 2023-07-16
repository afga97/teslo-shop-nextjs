import bcrypt from 'bcryptjs'
import { db } from ".";
import { User } from "../models";


export const checkUserEmailPassword = async (emailUser: string, password: string) => {

  await db.connect();
  const user = await User.findOne({ email: emailUser });
  await db.disconnect()

  if (!user) {
    return null
  }

  if (!bcrypt.compareSync(password, user.password!)) {
    return null
  }

  const { role, name, _id, email } = user

  return JSON.parse(JSON.stringify({
    id: _id,
    email,
    name,
    role
  }))
}

// Crea o verifica el usuario mediante el usuario de Oauth

export const oAuthToDbUser = async (oAuthEmail: string, oAuthName: string) => {
  await db.connect();
  try {
    const user = await User.findOne({ email: oAuthEmail });
    if (user) {
      await db.disconnect();
      const { _id, name, email, role } = user
      return { id: _id, name, email, role }
    }

    const newUser = new User({ email: oAuthEmail, name: oAuthName, password: '@', role: 'client' })
    await newUser.save()

    await db.disconnect();

    const { _id, name, email, role } = newUser

    return JSON.parse(JSON.stringify({
      id: _id,
      email,
      name,
      role
    }))
  } catch (error) {
    console.log(error);
    return null
  }

}
import NextAuth, { SessionStrategy } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { dbUsers } from "../../../database";

export const authOptions = {
  
  providers: [
    
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo: ', type: 'email', 'placeholder': 'correo@google.com' },
        password: { label: 'Contraseña: ', type: 'password', 'placeholder': 'Contraseña' }
      },
      async authorize(credentials) {
        // console.log({credentials})
        // return { name: 'Juan', correo: 'juan@google.com', role: 'admin' };
        return await dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password );
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    
  ],

  //Custom pages -> Indicar las rutas donde van a estar las paginas custom de login y registro 
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  session: {
    maxAge: 2592000, /// 30d
    strategy: "jwt" as SessionStrategy,
    updateAge: 86400, // cada día
  },

  callbacks: {

    async jwt({ token, account, user }: any){
      // console.log(token, account, user)
      if (account) {
        token.accessToken = account.acces_token

        switch (account.type) {
          case 'oauth':
            // Crear o verificar usuario si existe en db
            token.user = await dbUsers.oAuthToDbUser(user?.email || '', user?.name || '')
            break;
          case 'credentials':
            token.user = user
            break;
        
          default:
            break;
        }
      }
      return token
    },

    async session({ session, token, user}: any) {
      // console.log(session, token, user);
      session.accesToken = token.accessToken;
      session.user = token.user as any;
      return session
    }

  }
}
export default NextAuth(authOptions)
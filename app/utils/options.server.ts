import { prisma } from './prisma.server'

export const getUserOptions = async (userId: string) => {
  return await prisma.preferences.findUnique({
    where: {
      userId: userId
    }
  })
}

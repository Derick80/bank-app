import { prisma } from './prisma.server'

export interface UserProfile {
  firstName: string
  lastName: string
  bio: string
  avatarImage: string
  userId: string
}

export async function getUserProfile(userId: string) {
  return await prisma.profile.findUnique({
    where: {
      userId: userId
    }
  })
}

export async function updateUserProfile(fields: UserProfile) {
  return await prisma.profile.update({
    where: {
      userId: fields.userId
    },
    data: {
      firstName: fields.firstName,
      lastName: fields.lastName,
      bio: fields.bio,
      avatarImage: fields.avatarImage
    }
  })
}

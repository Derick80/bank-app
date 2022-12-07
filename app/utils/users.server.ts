import { Prisma } from '@prisma/client'
import { prisma } from './prisma.server'
import bcrypt from 'bcryptjs'

export const defaultUserSelect = {
  id: true,
  email: true,
  userName: true,
  password: false
}

export const createUser = async (input: Prisma.UserCreateInput) => {
  const hashedPassword = await bcrypt.hash(input.password, 10)
  return await prisma.user.create({
    data: {
      email: input.email,
      userName: input.userName,
      password: hashedPassword,
      profile: {
        create: {
          firstName: input.userName,
          lastName: '',
          bio: '',
          avatarImage: ''
        }
      }
    },
    select: defaultUserSelect
  })
}

export const getUser = async (input: Prisma.UserWhereUniqueInput) => {
  const user = await prisma.user.findUnique({
    where: input,
    select: defaultUserSelect
  })
  return user
}

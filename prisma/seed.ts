import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
    const seedEmail = (await process.env.SEED_EMAIL) as string

  // cleanup the existing database
  await prisma.user.delete({ where: { email: seedEmail } }).catch(() => {
    // no worries if it doesn't exist yet
  })

  const hashedPassword = (await process.env.HASHEDPASSWORD) as string

  const user = await prisma.user.create({
    data: {
      email: seedEmail,
      userName: 'Derick',
      password: hashedPassword,
      role: 'ADMIN',
      profile: {
        create: {
          firstName: 'Derick',
          lastName: 'Iderick',
          bio: 'I am a software developer',
          avatarImage:
            'https://blogphotosbucket.s3.us-east-2.amazonaws.com/profileimages/DerickFace.jpg'
        }
      }
    }
  })

  await prisma.income.createMany({
    data: [
      {
        userId: user.id,
        description: 'Tempus Payroll',
        amount: 3000,
        due_date: new Date('2022-11-01 01:00:00'),
        type: 'Payroll',
        frequency:'Bianually',
      },
      {
        userId: user.id,
        description: 'Tempus Payroll',
        amount: 3000,
        due_date: new Date('2022-11-15 01:00:00'),
        type: 'Payroll',
        frequency:'Bianually',
      },
      {
        userId: user.id,
        description: 'Tempus Payroll',
        amount: 3000,
        due_date: new Date('2022-12-01 01:00:00'),
        type: 'Payroll',
        frequency:'Bianually',
      },
      {
        userId: user.id,
        description: 'Tempus Payroll',
        amount: 3000,
        due_date: new Date('2022-12-15 01:00:00'),
        type: 'Payroll',
        frequency:'Bianually',
      },
      {
        userId: user.id,
        description: 'Tempus Payroll',
        amount: 3000,
        due_date: new Date('2023-01-01 01:00:00'),
        type: 'Payroll',
        frequency:'Bianually',
      },
      {
        userId: user.id,
        description: 'Tempus Payroll',
        amount: 3000,
        due_date: new Date('2023-01-15 01:00:00'),
        type: 'Payroll',
        frequency:'Bianually',
      },
      {
        userId: user.id,
        description: 'Tempus Payroll',
        amount: 3000,
        due_date: new Date('2023-02-01 01:00:00'),
        type: 'Payroll',
        frequency:'Bianually',
      },
      {
        userId: user.id,
        description: 'Tempus Payroll',
        amount: 3000,
        due_date: new Date('2023-02-15 01:00:00'),
        type: 'Payroll',
        frequency:'Bianually',
      },

      {
        userId: user.id,
        description: 'Rental_Income',
        amount: 200,
        due_date: new Date('2022-11-01 01:00:00'),

        type: 'Rental_Income',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Rental_Income',
        amount: 200,
        due_date: new Date('2022-12-01 01:00:00'),

        type: 'Rental_Income',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Rental_Income',
        amount: 200,
        due_date: new Date('2023-01-01 01:00:00'),

        type: 'Rental_Income',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Rental_Income',
        amount: 200,
        due_date: new Date('2023-02-01 01:00:00'),

        type: 'Rental_Income',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Rental_Income',
        amount: 200,
        due_date: new Date('2023-03-01 01:00:00'),

        type: 'Rental_Income',
        frequency: 'Monthly'
      }
    ]
  })

  await prisma.expense.createMany({
    data: [
      {
        userId: user.id,
        description: 'Car',
        accountNameId: '2010',
        amount: 600,
        due_date: new Date('2022-11-15 01:00:00'),
        type: 'Auto',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Car',
        accountNameId: '2010',
        amount: 600,
        due_date: new Date('2022-12-15 01:00:00'),
        type: 'Auto',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Car',
        accountNameId: '2010',
        amount: 600,
        due_date: new Date('2022-01-15 01:00:00'),
        type: 'Auto',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Car',
        accountNameId: '2010',
        amount: 600,
        due_date: new Date('2022-02-15 01:00:00'),
        type: 'Auto',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Mortgage',
        accountNameId: '9400',
        amount: 1500,
        due_date: new Date('2022-11-01 01:00:00'),

        type: 'Mortgage',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Mortgage',
        accountNameId: '9400',
        amount: 1500,
        due_date: new Date('2022-12-01 01:00:00'),

        type: 'Mortgage',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Mortgage',
        accountNameId: '9400',
        amount: 1500,
        due_date: new Date('2022-01-01 01:00:00'),

        type: 'Mortgage',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Mortgage',
        accountNameId: '9400',
        amount: 1500,
        due_date: new Date('2022-02-01 01:00:00'),

        type: 'Mortgage',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Gas Bill',
        accountNameId: '2011',
        amount: 100,
        due_date: new Date('2022-11-27 01:00:00'),
        type: 'Utilities',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Gas Bill',
        accountNameId: '2011',
        amount: 100,
        due_date: new Date('2022-12-27 01:00:00'),
        type: 'Utilities',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Gas Bill',
        accountNameId: '2011',
        amount: 100,
        due_date: new Date('2022-01-27 01:00:00'),
        type: 'Utilities',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Gas Bill',
        accountNameId: '2011',
        amount: 100,
        due_date: new Date('2022-02-27 01:00:00'),
        type: 'Utilities',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Grocery',
        accountNameId: 'Food Expense',
        amount: 150,
        due_date: new Date('2022-11-18 01:00:00'),
        type: 'Grocery',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Grocery',
        accountNameId: 'Food Expense',
        amount: 150,
        due_date: new Date('2022-12-18 01:00:00'),
        type: 'Grocery',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Grocery',
        accountNameId: 'Food Expense',
        amount: 150,

        due_date: new Date('2022-01-18 01:00:00'),
        type: 'Grocery',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Grocery',
        accountNameId: 'Food Expense',
        amount: 150,
        due_date: new Date('2022-02-18 01:00:00'),
        type: 'Grocery',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'American Education Services',
        accountNameId: 'AES1-3',
        amount: 350,
        due_date: new Date('2022-11-27 01:00:00'),
        type: `Student_Loan`,
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'American Education Services',
        accountNameId: 'AES1-3',
        amount: 350,
        due_date: new Date('2022-12-27 01:00:00'),
        type: `Student_Loan`,
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'American Education Services',
        accountNameId: 'AES1-3',
        amount: 350,
        due_date: new Date('2022-01-27 01:00:00'),
        type: `Student_Loan`,
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'American Education Services',
        accountNameId: 'AES1-3',
        amount: 350,
        due_date: new Date('2022-02-27 01:00:00'),
        type: `Student_Loan`,
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Chase',
        accountNameId: '7760',
        amount: 450,
        due_date: new Date('2022-11-15 01:00:00'),
        type: 'Credit_Card',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Chase',
        accountNameId: '7760',
        amount: 450,
        due_date: new Date('2022-12-15 01:00:00'),
        type: 'Credit_Card',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Chase',
        accountNameId: '7760',
        amount: 450,
        due_date: new Date('2022-01-15 01:00:00'),
        type: 'Credit_Card',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Chase',
        accountNameId: '7760',
        amount: 450,
        due_date: new Date('2022-02-15 01:00:00'),
        type: 'Credit_Card',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Goolge Drive',
        accountNameId: '9499',
        amount: 10.71,
        due_date: new Date('2022-11-09 01:00:00'),
        type: 'Monthly_Subscription_Service',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Goolge Drive',
        accountNameId: '9499',
        amount: 10.71,
        due_date: new Date('2022-12-09 01:00:00'),
        type: 'Monthly_Subscription_Service',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Goolge Drive',
        accountNameId: '9499',
        amount: 10.71,
        due_date: new Date('2022-01-09 01:00:00'),
        type: 'Monthly_Subscription_Service',
        frequency: 'Monthly'
      },
      {
        userId: user.id,
        description: 'Goolge Drive',
        accountNameId: '9499',
        amount: 10.71,
        due_date: new Date('2022-02-09 01:00:00'),
        type: 'Monthly_Subscription_Service',
        frequency: 'Monthly'
      }
    ]
  })

  console.log('data has been seeded')
}
seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

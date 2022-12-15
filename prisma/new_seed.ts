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

    const rent = await prisma.incomeCategory.create({
    data: {
        name: 'Rent',
        value:'Rent',
        label:'Rent',

    }
    })
const tmpInc = await prisma.incomeCategory.create({
    data: {
        name: 'Tempus',
        value:'Tempus',
        label:'Tempus Payroll',

    }
    })

    const incomeOtherTag = await prisma.incomeCategory.create({
        data: {
            name: 'Other',
            value:'Other',
            label:'Other',

        }
    })

    await prisma.expenseCategory.createMany({
        data: [
            {
                name: 'Other',
                value:'Other',
                label:'Other',

            },{
                name: 'Mortage',
                value:'Mortage',
                label:'Mortage',

            },
            {
                name: 'Credit',
                value:'Credit',
                label:'Credit Card',


            },
            {
                name: 'Condo',
                value:'Condo',
                label:'Condo Fees',

            },{
                name: 'Student',
                value:'Student',
                label:'Student Loans',

            },{
                name: 'Car',
                value:'Car',
                label:'Car Loan',

            },{
                name: 'Utilities',
                value:'Utilities',
                label:'Utilities',

            },
            {
                name: 'Grocery',
                value:'Grocery',
                label:'Grocery',

            },{
                name: 'Insurance',
                value:'Insurance',
                label:'Insurance',

            },{
                name: 'Entertainment',
                value:'Entertainment',
                label:'Entertainment',

            },{
                name: 'Travel',
                value:'Travel',
                label:'Travel',

            },{
                name: 'Clothing',
                value:'Clothing',
                label:'Clothing',

            },{
                name: 'Savings',
                value:'Savings',
                label:'Savings',

            },{
                name: 'Subscription',
                value:'Subscription',
                label:'Subscription',

            },

        ]
    })

    const rentalIncome1 = await prisma.income.create({
        data: {
            userId: user.id,
            description: 'Rental_Income',
            amount: 200,
            due_date: new Date('2022-12-01 01:00:00'),
            incomeCategories:{
                connectOrCreate:{
                    where:{
                        id:rent.id
                    },
                    create:{
                        name: 'Rent',
                        value:'Rent',
                        label:'Rent',

                    }
                }
            },

}
    })


   const rentalIncome2 = await prisma.income.create({
     data: {
       userId: user.id,
       description: 'Rental_Income',
       amount: 200,
       due_date: new Date('2023-01-01 01:00:00'),
       incomeCategories: {
         connectOrCreate: {
           where: {
             id: rent.id
           },
           create: {
             name: 'Rent',
             value: 'Rent',
             label: 'Rent'
           }
         }
       }
     }
   })
      const rentalIncome3 = await prisma.income.create({
        data: {
          userId: user.id,
          description: 'Rental_Income',

          amount: 200,
          due_date: new Date('2023-02-01 01:00:00'),
          incomeCategories: {
            connectOrCreate: {
              where: {
                id: rent.id
              },
              create: {
                name: 'Rent',
                value: 'Rent',
                label: 'Rent'
              }
            }
          }
        }
      })


    const tempusPayrollA_1 = await prisma.income.create({
        data: {
            userId: user.id,
            description:'Tempus Payroll',

            amount:3000,
            due_date: new Date('2022-12-01 01:00:00'),
            incomeCategories:{
                connect:{
                    id:tmpInc.id
                }
            }
        }
    })

   const tempusPayrollB_1 = await prisma.income.create({
     data: {
       userId: user.id,
       description: 'Tempus Payroll',

       amount: 3000,
       due_date: new Date('2022-12-15 01:00:00'),
       incomeCategories: {
         connect: {
           id: tmpInc.id
         }
       }
     }
   })
const tempusPayrollA_2 = await prisma.income.create({
  data: {
    userId: user.id,
    description: 'Tempus Payroll',

    amount: 3000,
    due_date: new Date('2023-01-01 01:00:00'),
    incomeCategories: {
      connect: {
        id: tmpInc.id
      }
    }
  }
})

const tempusPayrollB_2 = await prisma.income.create({
  data: {
    userId: user.id,
    description: 'Tempus Payroll',

    amount: 3000,
    due_date: new Date('2023-01-15 01:00:00'),
    incomeCategories: {
      connect: {
        id: tmpInc.id
      }
    }
  }
})
const tempusPayrollA_3 = await prisma.income.create({
  data: {
    userId: user.id,
    description: 'Tempus Payroll',
       amount: 3000,
    due_date: new Date('2023-02-01 01:00:00'),
    incomeCategories: {
      connect: {
        id: tmpInc.id
      }
    }
  }
})

const tempusPayrollB_3 = await prisma.income.create({
  data: {
    userId: user.id,
    description: 'Tempus Payroll',
       amount: 3000,
    due_date: new Date('2023-02-15 01:00:00'),
    incomeCategories: {
      connect: {
        id: tmpInc.id
      }
    }
  }
})


const mortgage1 = await prisma.expense.create({
    data: {
        userId: user.id,
        description: 'Mortgage',
        amount: 1000,
        due_date: new Date('2022-12-01 01:00:00'),
        expenseCategories: {
            connect: {
                name: 'Mortage'
            }
        }
    }

})
const mortgage2 = await prisma.expense.create({
  data: {
    userId: user.id,
    description: 'Mortgage',
    amount: 1000,
    due_date: new Date('2023-01-01 01:00:00'),
    expenseCategories: {
      connect: {
        name: 'Mortage'
      }
    }
  }
})
const mortgage3 = await prisma.expense.create({
  data: {
    userId: user.id,
    description: 'Mortgage',
    amount: 1000,
    due_date: new Date('2023-02-01 01:00:00'),
    expenseCategories: {
      connect: {
        name: 'Mortage'
      }
    }
  }
})

const carInsurance1 = await prisma.expense.create({
    data: {
        userId: user.id,
        description: 'Car Insurance',
        amount: 100,
        due_date: new Date('2022-12-12 01:00:00'),
        expenseCategories: {
            connect: {
                name:'Car'
            }
        }
    }
})

const carInsurance2 = await prisma.expense.create({
  data: {
    userId: user.id,
    description: 'Car Insurance',
    amount: 100,
    due_date: new Date('2023-01-12 01:00:00'),
    expenseCategories: {
      connect: {
        name: 'Car'
      }
    }
  }
})
const carInsurance3 = await prisma.expense.create({
  data: {
    userId: user.id,
    description: 'Car Insurance',
    amount: 100,
    due_date: new Date('2023-02-12 01:00:00'),
    expenseCategories: {
      connect: {
        name: 'Car'
      }
    }
  }
})

const gasBill1 = await prisma.expense.create({
    data: {
        userId: user.id,
        description: 'Gas Bill',
        amount:150,
        due_date: new Date('2022-12-18 01:00:00'),
        expenseCategories:{
            connect:{
                name:'Utilities'

        }
    }
}
})

const gasBill2 = await prisma.expense.create({
  data: {
    userId: user.id,
    description: 'Gas Bill',
    amount: 150,
    due_date: new Date('2023-01-18 01:00:00'),
    expenseCategories: {
      connect: {
        name: 'Utilities'
      }
    }
  }
})
const gasBill3 = await prisma.expense.create({
  data: {
    userId: user.id,
    description: 'Gas Bill',
    amount: 150,
    due_date: new Date('2023-02-18 01:00:00'),
    expenseCategories: {
      connect: {
        name: 'Utilities'
      }
    }
  }
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

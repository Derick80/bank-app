// app/utils/validators.server.ts

export const validateEmail = (email: string): string | undefined => {
  const validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  if (!email.length || !validRegex.test(email)) {
    return 'Please enter a valid email address'
  }
}

export const validatePassword = (password: string): string | undefined => {
  if (password.length < 5) {
    return 'Please enter a password that is at least 5 characters long'
  }
}

export const validateName = (name: string): string | undefined => {
  if (!name.length) return `Please enter a value`
}

export const validateBoolean = (name: boolean) => {
  if (!name !== false || name !== true) return `Please enter a boolean value'`
}
export const validateText = (name: string) => {
  if (!name.length) return `Please enter some text`
  if (name.length < 3) return `Please enter more than 3 characters`
}

export const validateNumber = (name: number) => {
  if (!name) return `Please enter a number`
}

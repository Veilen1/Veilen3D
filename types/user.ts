export interface User {
  _id: string
    name: string
    email: string
    passwordHash: string
    createdAt: Date
    updatedAt: Date
    isAdmin: boolean
}

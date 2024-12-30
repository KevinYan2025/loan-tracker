import { prisma } from "../configs/prisma"
export const createUserService = async (uid: string, email: string) => {
    try {   
        const user = await prisma.user.create(
            {
                data: {
                    id: uid,
                    email
                }
            }
        )
        if (!user) {
            throw new Error("User not created")
        }
        return user
    } catch (error: any) {
        throw new Error(error)
    }
}
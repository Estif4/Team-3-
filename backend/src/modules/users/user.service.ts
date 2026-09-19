import { User } from "./user.model";

export class UserService {
  
    static async getUserById(userId: string) {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");
        return user;
    }

    
    static async getAllUsers() {
      
        return await User.find({ isActive: true }).select("displayName email avatarColor role");
    }
}
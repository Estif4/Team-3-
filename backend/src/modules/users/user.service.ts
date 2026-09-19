import { User } from "./user.model";
import { UpdateUserDto } from "./user.types";

export class UserService {
    static async getUserById(userId: string) {
        const user = await User.findById(userId).select("-password");
        if (!user) throw new Error("User not found");
        return user;
    }

    static async getAllUsers() {
        return await User.find({ isActive: true }).select("displayName email avatarColor role lastSeenAt");
    }

    static async updateUser(userId: string, data: UpdateUserDto) {
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: data },
            { new: true, runValidators: true }
        ).select("-password");
        if (!user) throw new Error("User not found");
        return user;
    }
}
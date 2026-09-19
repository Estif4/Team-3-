import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../users/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_hackathon_key";

export class AuthService {
    static async register(data: any) {
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) throw new Error("Email already in use");

        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        const user = await User.create({
            ...data,
            password: hashedPassword
        });

        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        
        return { user, token };
    }

    static async login(email: string, password: string) {
        // Need to explicitly select password because it's set to select: false in the model
        const user = await User.findOne({ email }).select("+password");
        if (!user) throw new Error("Invalid credentials");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        
        // Remove password from the returned object
        const userObj = user.toObject();
        // @ts-ignore
        delete userObj.password;

        return { user: userObj, token };
    }
}
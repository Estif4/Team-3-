import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../users/user.model";
import { RegisterDto, LoginDto } from "./auth.types";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_hackathon_key";

export class AuthService {
    static async register(data: RegisterDto) {
        const email = data.email.toLowerCase().trim();
        const existingUser = await User.findOne({ email });
        if (existingUser) throw new Error("Email already in use");

        const hashedPassword = await bcrypt.hash(data.password, 10);
        
        const user = await User.create({
            ...data,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        
        const userObj = user.toObject();
        delete (userObj as any).password;

        return { user: userObj, token };
    }

    static async login(data: LoginDto) {
        const email = data.email.toLowerCase().trim();
        // Need to explicitly select password because it's set to select: false in the model
        const user = await User.findOne({ email }).select("+password");
        if (!user) throw new Error("Invalid credentials");

        if (!user.password) throw new Error("Invalid credentials");

        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        
        // Remove password from the returned object
        const userObj = user.toObject();
        delete (userObj as any).password;

        return { user: userObj, token };
    }
}
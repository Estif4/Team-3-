import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { connectDb } from "../src/config/db";
import { User } from "../src//modules/users/user.model";

const run = async () => {
  await connectDb();
  const secret = process.env.JWT_SECRET!;

  for (const [name, email] of [
    ["Alice", "alice@test.com"],
    ["Bob", "bob@test.com"],
  ]) {
    const user =
      (await User.findOne({ email })) ??
      (await User.create({ name, email, password: "dev-only-not-a-hash" }));
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: "7d" });
    console.log(`\n${name} (${user.id})\n${token}`);
  }

  await mongoose.disconnect();
};

run();

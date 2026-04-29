import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { MONGO_URI } from "../constants.js";
import User from "../models/user.model.js";

// ------ DEFAULT ADMIN CREDENTIALS

const ADMIN_DATA = {
   firstName: "Admin",
   lastName: "User",
   email: "admin@admin.com",
   password: "admin123",
   role: "admin",
};

// ------ SEED ADMIN

const seedAdmin = async () => {
   try {
      // ------ connect to DB
      await mongoose.connect(MONGO_URI);
      console.log("(MONGODB CONNECTED) for seeding");

      // ------ check if admin already exists
      const existingAdmin = await User.findOne({
         email: ADMIN_DATA.email,
         role: "admin",
      });

      if (existingAdmin) {
         console.log("(SEED SKIPPED) Admin already exists:");
         console.log(`   Email: ${existingAdmin.email}`);
         console.log(`   Role: ${existingAdmin.role}`);
         process.exit(0);
      }

      // ------ create admin (password will be hashed by pre-save middleware)
      const admin = await User.create(ADMIN_DATA);

      console.log("(SEED SUCCESS) Admin created:");
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: ${ADMIN_DATA.password}`);
      console.log(`   Role: ${admin.role}`);

      process.exit(0);
   } catch (error) {
      console.error("(SEED ERROR)", error.message);
      process.exit(1);
   }
};

seedAdmin();

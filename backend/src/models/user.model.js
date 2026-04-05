import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

// ------ USER SCHEMA

const userSchema = new Schema(
   {
      firstName: {
         type: String,
         trim: true,
         required: true,
      },
      lastName: {
         type: String,
         trim: true,
      },
      phoneNo: {
         type: String,
      },
      address: {
         street: {
            type: String,
         },
         city: {
            type: String,
         },
         state: {
            type: String,
         },
         country: {
            type: String,
         },
      },
      email: {
         type: String,
         trim: true,
         unique: true,
         lowercase: true,
         required: true,
      },
      password: {
         type: String,
         select: false,
         required: true,
      },
      role: {
         type: String,
         enum: ["customer", "admin"],
         default: "customer",
         required: true,
      },
      refreshToken: {
         type: String,
      },
   },
   { timestamps: true },
);

// ------ PRE-MIDDLEWARE FOR PASSWORD HASHING

userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return;
   this.password = await bcrypt.hash(this.password, 10);
   next();
});

// ------ COMPARE PASSWORD METHOD

userSchema.methods.comparePassword = async function (password) {
   return await bcrypt.compare(password, this.password);
};

// ------ USER MODEL

const User = model("User", userSchema);
export default User;

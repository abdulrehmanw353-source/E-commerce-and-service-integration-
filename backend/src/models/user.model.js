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

userSchema.pre("save", async function () {
   if (!this.isModified("password")) return next();
   this.password = await bcrypt.hash(this.password, 10);
});

// ------ COMPARE PASSWORD METHOD

userSchema.methods.comparePassword = async function (password) {
   return await bcrypt.compare(password, this.password);
};

// ------ SCHEMA TRANSFORMATION BEFORE SENDING RESPONSE

const options = {
   transform: function (doc, ret) {
      delete ret.password;
      delete ret.refreshToken;
      delete ret.__v;
      return ret;
   },
};

userSchema.set("toJSON", options);
userSchema.set("toObject", options);

/*
   NOTE: The "toJSON" just trigger on res.json()
   when its mongoose document not for plain JS object,
   and remove password!
   The "toObject" triggers when we manually convert
   mongoose document into plain JS object using .toObject()
   method.
*/

// ------ USER MODEL

const User = model("User", userSchema);
export default User;

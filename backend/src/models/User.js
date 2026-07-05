import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    from: Date,
    to: Date,
    current: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    school: {
      type: String,
      trim: true,
    },
    degree: {
      type: String,
      trim: true,
    },
    field: {
      type: String,
      trim: true,
    },
    from: Date,
    to: Date,
    current: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "employer", "candidate"],
      default: "candidate",
    },

    profile: {
      phone: {
        type: String,
        trim: true,
      },

      location: {
        type: String,
        trim: true,
      },

      company: {
        type: String,
        trim: true,
      },

      website: {
        type: String,
        trim: true,
      },

      bio: {
        type: String,
        maxlength: 500,
      },

      skills: [
        {
          type: String,
          trim: true,
        },
      ],

      experience: [experienceSchema],

      education: [educationSchema],
    },

    // Resume fields - Cloudinary integration
    resume: {
      type: String,
      default: "",
    },

    resumeUrl: {
      type: String,
      default: "",
    },

    resumePublicId: {
      type: String,
      default: "",
    },

    resumeName: {
      type: String,
      default: "",
    },

    resumeUploadedAt: {
      type: Date,
    },

    resumeParsed: {
      type: Boolean,
      default: false,
    },

    resumeText: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });

/**
 * Hash password before saving
 */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compare Password
 */
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

/**
 * Remove password from JSON response
 */
userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;

  return user;
};

const User = mongoose.model("User", userSchema);

export default User;
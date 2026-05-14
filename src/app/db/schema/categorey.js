import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    uuid: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  },
);
const user = mongoose.model("categorey",userSchema)
export default user
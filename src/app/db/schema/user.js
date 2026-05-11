import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    uuid: {
      type: String,
      require: true,
    },
    user_name:{
        type:String,
    },
    user_email: {
      type: String,
      require: true,
    },
    user_pass: {
      type: String,
      require: true,
    },
    user_role:{
        type:String,
        require:true
    }
  },
  {
    timestamps: true,
  },
);
const user = mongoose.model("user",userSchema)
export default user
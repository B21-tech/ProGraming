import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: {
    type: String, 
    require: true,
    unique: true,
  },
  description: {
    type: String, 
    default: "",
  },
  levels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Level",
    },
  ],
});

export default mongoose.model("Course", courseSchema);
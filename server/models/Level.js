import mongoose from "mongoose";

const levelSchema = new mongoose.Schema({
  name: {type: String},
  order: {type: Number},
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  stages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stage" }],
});


export default mongoose.model("Level", levelSchema);
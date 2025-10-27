import mongoose from "mongoose";

const stageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    order: { type: Number, required: true },
    level: { type: mongoose.Schema.Types.ObjectId, ref: "Level" },
    isLocked: { type: Boolean, default: false },
});

export default mongoose.model("Stage", stageSchema);
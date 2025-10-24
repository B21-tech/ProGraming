import mongoose from "mongoose"

const questionSchema = new mongoose.Schema({
    text: {type: String, required: true},
    options: [{ type: String}],
    correctAnswer: {type: String, required: true},
    stage: {type: mongoose.Schema.Types.ObjectId, ref: 'Stage', required: true},
    explanation: {type: String},
});

export default mongoose.model("Question", questionSchema);
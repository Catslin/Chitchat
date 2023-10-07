const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Articles = require("./article");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  articles: [{ type: Schema.Types.ObjectId, ref: "Articles" }],
});

userSchema.statics.findUserByName = async function (name) {
  const user = await this.findOne({ name });
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

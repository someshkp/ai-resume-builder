const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required to be added in blacklist"],
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const tokenBlacklistModel = mongoose.model("BlacklistTokens", blacklistSchema);

module.exports = tokenBlacklistModel;

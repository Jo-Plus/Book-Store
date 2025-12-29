const mongoose = require("mongoose");

let isConnected = false;

module.exports = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    });

    isConnected = db.connections[0].readyState;
    console.log("Connected To DB ^_^");
  } catch (err) {
    console.error("Connection Failed To DB!", err);
    throw err;
  }
};

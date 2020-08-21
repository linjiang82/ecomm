import config from "../config/config";
import app from "./express";
import mongoose from "mongoose";
// import devBundle from "./devBundle";

//devbundle compile client side code on the fly
// devBundle.compile(app);

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`);
});
//start listen
app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  }
  console.info("Server started on port %s.", config.port);
});

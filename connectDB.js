const connectDb = async () => {
  try {
    await client.connect();
    console.log("DB connect successfully.");
  } catch (err) {
    console.error(err);
  }
};

connectDb();


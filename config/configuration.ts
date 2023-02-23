export default () => ({
  database: {
    host: `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`,
  },
});

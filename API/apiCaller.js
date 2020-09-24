var ppl_db = require("../ppl_schema");

module.exports = {
  usernameCheck: async (data) => {
    try {
      console.log("datattat", data);
      const nameExist = await ppl_db.findOne({ username: data.username });
      return nameExist;
    } catch (error) {
      throw error;
    }
  },
  emailCheck: async (data) => {
    try {
      const emailExist = await ppl_db.findOne({ email: data.email });
      return emailExist;
    } catch (error) {
      throw error;
    }
  },
  passwordCheck: async (data) => {
    try {
      const _password = await ppl_db.findOne({ password: data.password });
      return _password;
    } catch (error) {
      throw error;
    }
  },
  addUser: async (data) => {
    try {
      const userData = ppl_db.create(data);
      return userData;
    } catch (error) {
      throw error;
    }
  },
};

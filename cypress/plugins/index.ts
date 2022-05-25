// Plugins enable you to tap into, modify, or extend the internal behavior of Cypress
// For more info, visit https://on.cypress.io/plugins-api
module.exports = (on, config) => {
  // in plugins file
  on('task', {
    log(message) {
      console.log(message);
      return null;
    },
  });
};

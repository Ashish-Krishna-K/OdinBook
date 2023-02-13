// eslint-disable-next-line import/no-extraneous-dependencies
const { faker } = require('@faker-js/faker');

const createRandomUser = () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email(firstName.toLowerCase(), lastName.toLowerCase());
  return {
    uid: 103238712683120,
    email,
    display_name: `${firstName} ${lastName}`
  };
};

const User = require('./models/userModel');

exports.createFakeUsers = () => {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i <= 10; i++) {
    const data = createRandomUser();
    const newUser = new User(data);
    newUser.save((err) => (err ? console.log(err) : console.log('created')));
  }
};

exports.createRandomLines = () => faker.lorem.lines();

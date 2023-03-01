const validate = require('mongoose-validator');

const nameValidator = [
    validate({
      validator: 'isLength',
      arguments: [0, 40],
      message: 'Name must not exceed {ARGS[1]} characters.'
    })
  ];
  
  const emailValidator = [
    validate({
      validator: 'isLength',
      arguments: [0, 40],
      message: 'Email must not exceed {ARGS[1]} characters.'
    }),
    validate({
      validator: 'isEmail',
      message: 'Email must be valid.'
    })
  ];
  
  const usernameValidator = [
    validate({
      validator: 'isLength',
      arguments: [3, 15],
      message: 'Username must be between {ARGS[0]} and {ARGS[1]} characters.'
    }),
    validate({
      validator: 'matches',
      arguments: /^[A-Za-z][-_A-Za-z0-9]+$/,
      message: 'Username must start with a letter and must not have special characters except - and _.'
    })
  ];
  
  const passwordValidator = [
    validate({
      validator: 'isLength',
      arguments: [6, 20],
      message: 'Password must be between {ARGS[0]} and {ARGS[1]} characters.'
    })
  ];

  module.exports = {
    nameValidator: nameValidator,
    emailValidator: emailValidator,
    usernameValidator: usernameValidator,
    passwordValidator: passwordValidator
  }
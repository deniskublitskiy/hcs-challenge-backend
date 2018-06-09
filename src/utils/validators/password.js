
/**
 * @type {RegExp} PasswordRegex
 * ^                         Start anchor
 * (?=.*[A-Z].*[A-Z])        Ensure string has two uppercase letters.
 * (?=.*[!@#$&*])            Ensure string has one special case letter.
 * (?=.*[0-9].*[0-9])        Ensure string has two digits.
 * (?=.*[a-z].*[a-z].*[a-z]) Ensure string has three lowercase letters.
 * .{8}                      Ensure string is of length greater than 8.
 * $                         End anchor.
 */
const PASSWORD_REGEX_COMPLEX = /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/;

module.exports.passwordValidator = password => PASSWORD_REGEX_COMPLEX.test(password);

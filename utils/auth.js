const bcrypt = require('bcrypt');

/**
 * Utilitários de autenticação com bcrypt
 */

/**
 * Gera hash segura para password
 * @param {string} password - Password em texto simples
 * @returns {Promise<string>} Hash da password
 */
async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compara password com hash
 * @param {string} password - Password em texto simples
 * @param {string} hash - Hash armazenada na BD
 * @returns {Promise<boolean>} True se coincidirem
 */
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = {
  hashPassword,
  comparePassword
};
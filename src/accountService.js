const accountRepository = require('./accountRepository')

module.exports = {
  getAccount: getAccount
};

async function getAccount(account){
  try{
    return await accountRepository.getAccount(account);
  }
  catch(error){
    console.log('accountService::getAccount::error');
    throw error;
  }
}
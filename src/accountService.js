const accountRepository = require('./accountRepository')

module.exports = {
  getAccount: getAccount,
  deposit: deposit
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

async function deposit(account, amount){
  try{
    console.log('accountService::deposit');
    account.balance += amount;
    await accountRepository.saveAccount(account);
    return account;
  }
  catch(error){
    console.log('accountService::deposit::error');
    throw error;
  }
}
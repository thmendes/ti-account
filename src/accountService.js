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

async function deposit(account, deposit){
  try{
    console.log('accountService::deposit');
    account.balance += deposit.amount;
    Object.assign(deposit, {date: new Date().toISOString()})
    if(account.history){
      account.history.push(deposit);
    }
    else{
      Object.assign(account, { history: [deposit]});
    }
    await accountRepository.saveAccount(account);
    return deposit;
  }
  catch(error){
    console.log('accountService::deposit::error');
    throw error;
  }
}
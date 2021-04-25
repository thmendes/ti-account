const errorUtil = require('./errorUtil');
const accountService = require('./accountService')
const { crc32 } = require('crc');
const authApi = require('./apis/authApi')
const depositValidation = require('./validation/depositValidation')
module.exports = {
  getAccount: getAccount,
  deposit: deposit
};

async function getAccount(req, res){
  try{
    console.time('getAccount');
    console.log('accountController::getAccount');

    if(!await validateUser(req.params.email, req.headers.authorization))
      throw {name: 'NOT_AUTHORIZED', message: errorUtil.knownErrors.NOT_AUTHORIZED, errors: []}

    const accountCode = generateAccoountCode(req.params.email);
    const response = await accountService.getAccount(accountCode);
    res.json(response);
  }
  catch(error){
    console.log('accountController::getAccount::error', error);
    const errorResponse = errorUtil.errorResponse(error.name, error.message, error.errors);
    res.status(errorResponse.statusCode).send(errorResponse.body);
  }
  finally{
    console.timeEnd('getAccount');
  }
}

async function deposit(req, res){
  try{
    console.time('deposit');
    console.log('accountController::deposit');
  
    const validationResult = depositValidation.validateDeposit(req.body)
    if(validationResult.errors.length > 0)
      throw {name: 'DEPOSIT_MALFORMATED', message: errorUtil.knownErrors.DEPOSIT_MALFORMATED, errors: validationResult.errors}

    const account = await accountService.getAccount(req.body.target.account);

    if(!account.Item)
      throw {name: 'NOT_FOUND', message: errorUtil.knownErrors.ACCOUNT_NOT_FOUND, errors: []}

    console.log(account.Item)
    if(account.Item.cpf != req.body.origin.cpf)
      throw {name: 'NOT_AUTHORIZED', message: errorUtil.knownErrors.NOT_AUTHORIZED, errors: [{ message: "CPF de origem diferente do CPF da conta destino."}]}

    const response = await accountService.deposit(account.Item, req.body);
    res.json(response);
  }
  catch(error){
    console.log('accountController::deposit::error', error);
    const errorResponse = errorUtil.errorResponse(error.name, error.message, error.errors);
    res.status(errorResponse.statusCode).send(errorResponse.body);
  }
  finally{
    console.timeEnd('deposit');
  }
}

function generateAccoountCode(email){
  return crc32(email).toString(16); 
}

async function validateUser(email, token){
  const user = await authApi.getUser(token);
  userEmail = user.UserAttributes.find(att => att.Name == 'email').Value;
  return email == userEmail;
}
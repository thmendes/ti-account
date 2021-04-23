const errorUtil = require('./errorUtil');
const accountService = require('./accountService')
const { crc32 } = require('crc');
const authApi = require('./apis/authApi')
module.exports = {
  getAccount: getAccount
};

async function getAccount(req, res){
  try{
    console.time('getAccount');
    console.log('accountController::getAccount');

    if(!await validateUser(req.params.email, req.headers.authorization))
      throw {name: 'EMAIL_MALFORMED', message: errorUtil.knownErrors.EMAIL_MALFORMED, errors: []}

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

function generateAccoountCode(email){
  return crc32(email).toString(16); 
}

async function validateUser(email, token){
  const user = await authApi.getUser(token);
  userEmail = user.UserAttributes.find(att => att.Name == 'email').Value;
  return email == userEmail;
}
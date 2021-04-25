const errorUtils  = require('./errorUtil');
const AWS = require('aws-sdk');

const accountTable = process.env.ACCOUNT_TABLE;
const DYNAMODB_CLIENT = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  region: "us-east-1"
});

module.exports = {
  getAccount: getAccount,
  saveAccount: saveAccount
};

async function getAccount(accountCode){
  try{
    console.log('accountRepository::getAccount', accountCode);
    const params = {
      TableName: accountTable,
      Key: { id: accountCode }
    };
    return await DYNAMODB_CLIENT.get(params).promise()
  }
  catch(error){
    console.log('accountRepository::getAccount::error', error);
    throw { name : "Internal", message : errorUtils.knownErrors.INTERNAL, errors: []};
  }
}

async function saveAccount(account){
  try{
    console.log('accountRepository::saveAccount', account);
    const params = {
      TableName: accountTable,
      Item: account
    }
    return await DYNAMODB_CLIENT.put(params).promise()
  }
  catch(error){

  }
}
var Validator = require('jsonschema').Validator;
var v = new Validator();

module.exports = {
  validateDeposit: validateDeposit
}

var targetSchema = {
  "id": "/target",
  "type": "object",
  "properties": {
    "bank": {
      "type": "string",
      "pattern": "^352$"
    },
    "branch": {
      "type": "string",
      "pattern": "^[0-0]{3}1$"
    },
    "account": {
      "type": "string",
    },
    "required": [ "banck", "branch", "account" ]
  }
}

var originSchema = {
  "id": "/origin",
  "type": "object",
  "properties": {
    "bank": {
      "type": "string",
    },
    "branch": {
      "type": "string",
    },
    "account": {
      "type": "string",
    },
    "required": [ "banck", "branch", "account" ]
  }
}

var depositSchema = {
  "id": "/deposit",
  "type": "object",
  "properties": {
    "event": {"type": "string"},
    "target": {"$ref": "/target"},
    "origin": {"$ref": "/origin"},
    "amount": {"type": "number"}
  },
  "required": [ "event", "target", "amount" ]
};

v.addSchema(targetSchema, '/target');
v.addSchema(originSchema, '/origin');

function validateDeposit(deposit){
  return v.validate(deposit, depositSchema, {nestedErrors: true});
}
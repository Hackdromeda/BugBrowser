const _ = require('lodash')

function validateStatus (status) {
  if (!_.includes(['active', 'completed'], _.toLower(status))) {
    throw Error('List status can only be "active" or "completed"!')
  }
}

function validateListName (listName) {
  if (!_.trim(listName)) {
    throw Error('List name cannot be empty!')
  }
}

function validateListItemName (listItemName) {
  if (!_.trim(listItemName)) {
    throw Error('List item name cannot be empty')
  }
}

function validateUpdateCustomList (body) {
  if (_(['name', 'state', 'version']).union(_.keys(body)).size() !== 3) {
    console.error(body)
    throw Error('Body has invalid properties. Only "name", "state" and "version" are allowed!')
  }

  validateListName(body.name)
  validateStatus(body.state)

  if (_.size(_.trim(body.name)) > 256) {
    throw Error('List name cannot be greater than 256 characters!')
  }

  if (!_.isNumber(body.version)) {
    throw Error('Version must be a number!')
  }
}

function validateUpdateListItem (body) {
  if (_(['status', 'value', 'version']).union(_.keys(body)).size() !== 3) {
    console.error(body)
    throw Error('Body has invalid properties. Only "value", "status" and "version" are allowed!')
  }

  validateListName(body.value)
  validateStatus(body.status)

  if (_.size(_.trim(body.value)) > 256) {
    throw Error('List value cannot be greater than 256 characters!')
  }

  if (!_.isNumber(body.version)) {
    throw Error('Version must be a number!')
  }
}

module.exports = {
  status: validateStatus,
  listName: validateListName,
  listItemName: validateListItemName,
  updateCustomList: validateUpdateCustomList,
  updateListItem: validateUpdateListItem
}

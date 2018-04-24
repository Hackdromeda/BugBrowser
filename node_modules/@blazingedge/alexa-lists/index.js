const _ = require('lodash')
const got = require('got')

const routes = require('./routes')
const utils = require('./utils')
const validate = require('./validate')

function getPermissionsCard () {
  return {
    type: 'AskForPermissionsConsent',
    permissions: [
      'read::alexa:household:list',
      'write::alexa:household:list'
    ]
  }
}

function makeRequest (apiToken) {
  return function _makeRequest (routeObj, body = {}) {
    const options = _.assign({body}, routeObj.options, {
      headers: {
        Authorization: `Bearer ${apiToken}`
      },
      json: true
    })
    return got(routeObj.url, options)
  }
}

function init (token) {
  token = token || process.env.ALEXA_API_TOKEN
  const makeRequestFn = makeRequest(token)

  function createCustomList (listName) {
    validate.listName(listName)

    const body = {
      name: listName,
      state: 'active'
    }
    return makeRequestFn(routes.createCustomList(), body)
    .then(utils.stripPropertyFromResponse())
  }

  function createNewListItem (listName, listItemName, status = 'active') {
    validate.listItemName(listItemName)

    return getList(listName, status).then(function (list) {
      const body = {
        value: listItemName,
        status
      }
      return makeRequestFn(routes.createNewListItem(list.listId), body)
    })
    .then(utils.stripPropertyFromResponse())
  }

  function deleteCustomList (listName) {
    validate.listName(listName)

    return getListMetadata()
    .then(function (lists) {
      const list = utils.findSpecificList(lists, listName)

      if (!list) {
        throw Error('List not found!')
      }
      return makeRequestFn(routes.deleteCustomList(list.listId))
    })
    .then(utils.stripPropertyFromResponse())
  }

  function deleteListItem (listName, listItemName) {
    validate.listItemName(listItemName)

    return getListMetadata()
    .then(function (lists) {
      const list = utils.findSpecificList(lists, listName)

      if (!list) {
        throw Error('List not found!')
      }

      return makeRequestFn(routes.getList(list.listId, list.state))
    })
    .then(function (list) {
      const listItem = utils.findSpecificListItem(_.get(list, 'body.items'), listItemName)
      return makeRequestFn(routes.deleteListItem(_.get(list, 'body.listId'), listItem.id))
    })
    .then(utils.stripPropertyFromResponse())
  }

  function getList (listName, status = 'active') {
    validate.listName(listName)
    validate.status(status)

    return getListMetadata()
    .then(function (lists) {
      const list = utils.findSpecificList(lists, listName, status)

      if (!list) {
        throw Error('List not found!')
      }
      return makeRequestFn(routes.getList(list.listId, status))
    })
    .then(utils.stripPropertyFromResponse())
  }

  function getListItem (listName, listItemName, status = 'active') {
    validate.listItemName(listItemName)

    return getList(listName, status)
    .then(function (list) {
      const listItem = utils.findSpecificListItem(list.items, listItemName)
      return makeRequestFn(routes.getListItem(list.listId, listItem.id))
    })
    .then(utils.stripPropertyFromResponse())
  }

  function getListMetadata () {
    return makeRequestFn(routes.getListMetadata())
    .then(utils.stripPropertyFromResponse('body.lists'))
  }

  function updateCustomList (listName, body) {
    validate.listName(listName)

    return getListMetadata()
    .then(function (lists) {
      const list = utils.findSpecificList(lists, listName)
      const reqBody = _.assign(_.pick(list, ['name', 'state', 'version']), body)

      if (!list) {
        throw Error('List not found')
      }

      validate.updateCustomList(reqBody)
      return makeRequestFn(routes.updateCustomList(list.listId), reqBody)
    })
    .then(utils.stripPropertyFromResponse())
  }

  function updateListItem (listName, listItemName, body) {
    validate.listName(listName)
    validate.listItemName(listItemName)

    return getListMetadata()
    .then(function (lists) {
      const list = utils.findSpecificList(lists, listName)
      return makeRequestFn(routes.getList(list.listId, list.state))
    })
    .then(function (list) {
      const listItem = utils.findSpecificListItem(_.get(list, 'body.items'), listItemName)

      if (!listItem) {
        throw Error('List item not found!')
      }

      const reqBody = _.assign(_.pick(listItem, ['status', 'value', 'version']), body)

      validate.updateListItem(reqBody)

      return makeRequestFn(routes.updateListItem(_.get(list, 'body.listId'), listItem.id), reqBody)
    })
    .then(utils.stripPropertyFromResponse())
  }

  return {
    createCustomList,
    createNewListItem,
    deleteCustomList,
    deleteListItem,
    getList,
    getListItem,
    getListMetadata,
    updateCustomList,
    updateListItem
  }
}

module.exports = {
  getPermissionsCard,
  init,
  routes
}

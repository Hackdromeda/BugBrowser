const host = 'https://api.amazonalexa.com'
const methods = {
  DELETE: 'DELETE',
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT'
}

function createRoute (url, method) {
  return {
    url: `${host}/${url}`,
    options: {
      method
    }
  }
}

/*
  ------------------------------------------
  ----------------- LEGEND -----------------
  Create a custom list                      POST  v2/householdlists/
  Create a new list item                    POST  v2/householdlists/{listId}/items
  Delete a custom list                      DELETE  v2/householdlists/{listId}
  Delete a list item                        DELETE  v2/householdlists/{listId}/items/{itemId}
  Get a list                                GET v2/householdlists/{listId}/{status}
  Get a list item                           GET v2/householdlists/{listId}/items/{itemId}
  Get lists metadata                        GET v2/householdlists/
  Update a custom list's `name` or `status` PUT v2/householdlists/{listId}
  Update a list item                        PUT v2/householdlists/{listId}/items/{itemId}
  ------------------------------------------
  --------------- END LEGEND ---------------
*/

const routes = {
  createCustomList: function () {
    return createRoute('v2/householdlists/', methods.POST)
  },
  createNewListItem: function (listId) {
    return createRoute(`v2/householdlists/${listId}/items/`, methods.POST)
  },
  deleteCustomList: function (listId) {
    return createRoute(`v2/householdlists/${listId}`, methods.DELETE)
  },
  deleteListItem: function (listId, itemId) {
    return createRoute(`v2/householdlists/${listId}/items/${itemId}`, methods.DELETE)
  },
  getList: function (listId, status) {
    return createRoute(`v2/householdlists/${listId}/${status}`, methods.GET)
  },
  getListItem: function (listId, itemId) {
    return createRoute(`v2/householdlists/${listId}/items/${itemId}`, methods.GET)
  },
  getListMetadata: function () {
    return createRoute('v2/householdlists/', methods.GET)
  },
  updateCustomList: function (listId) {
    return createRoute(`v2/householdlists/${listId}`, methods.PUT)
  },
  updateListItem: function (listId, itemId) {
    return createRoute(`v2/householdlists/${listId}/items/${itemId}`, methods.PUT)
  }
}

module.exports = routes

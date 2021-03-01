import Api from "./api";

const api = {
  demo: (id, name, message) =>
      Api('GET', `/api/item/${id}`)
          .query({name})
          .body({message})
          .done(),


  // networks
  listNetworks: () =>
      Api('GET', `/api/network`).done(),

  createNetwork: (network) =>
      Api('POST', `/api/network`)
          .body(network)
          .done(),

  deleteNetwork: (id) =>
      Api('DELETE', `/api/network/${id}`).done(),

  stopNetwork: (id) =>
      Api('POST', `/api/network/${id}/stop`).done(),


  // user
  listUsers: () =>
      Api('GET', `/api/user`).done(),

  createUser: (user) =>
      Api('POST', `/api/user`)
          .body(user)
          .done(),

  deleteUser: (url) =>
      Api('DELETE', `/api/user`)
          .body(url)
          .done(),
}

export default api;

import Api from "./api";

const api = {
  demo: (id, name, message) =>
      Api('GET', `/api/item/${id}`)
          .query({name})
          .body({message})
          .done(),

  // networks
  getNetworks: () =>
      Api('GET', `/api/network`).done(),

  createNetwork: (network) =>
      Api('POST', `/api/network`)
          .body(network)
          .done(),

  deleteNetwork: (id) =>
      Api('DELETE', `/api/network/${id}`).done(),

  stopNetwork: (id) =>
      Api('POST', `/api/network/${id}/stop`).done(),
}

export default api;

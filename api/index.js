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

  deleteNetwork: (name) =>
      Api('DELETE', `/api/network`)
          .body(name)
          .done(),

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

  listOrganizationsByNetwork: (network) =>
      Api('GET', `/api/organization`)
          .query(network)
          .done(),


  // channel
  listChannels: () =>
      Api('GET', `/api/channel`).done(),

  createChannel: (channel) =>
      Api('POST', `/api/channel`)
          .body(channel)
          .done(),

  deleteChannel: (name) =>
      Api('DELETE', `/api/channel`)
          .body(name)
          .done(),

  listPeersByNetwork: (networkUrl) =>
      Api('GET', `/api/peer`)
          .query({ network: networkUrl })
          .done(),

  // organization
  listOrganizations: () =>
      Api('GET', `/api/organization`).done(),

  createOrganization: (organization) =>
      Api('POST', `/api/organization`)
          .body(organization)
          .done(),

  deleteOrganization: (name) =>
      Api('DELETE', `/api/organization`)
          .body(name),

  listPeersByOrganization: (organizationUrl) =>
      Api('GET', `/api/peer`)
          .query({ organization: organizationUrl })
          .done(),
}

export default api;

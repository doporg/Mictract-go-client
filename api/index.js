import Api from "./api";

const api = {
  // ==================== network ====================
  listNetworks: () =>
      Api('GET', `/api/network`).done(),

  // Example:
  // {
  //     consensus: 'solo',
  //     tlsEnabled: true,
  //     ordererCount: 1,
  //     peerCounts: [ 2, 2 ],
  // }
  createNetwork: (network) =>
      Api('POST', `/api/network`)
          .body(network)
          .done(),

  // Example:
  // { name: 'net1' }
  deleteNetwork: (name) =>
      Api('DELETE', `/api/network`)
          .body(name)
          .done(),

  stopNetwork: (id) =>
      Api('POST', `/api/network/${id}/stop`).done(),


  // ==================== user ====================
  listUsers: () =>
      Api('GET', `/api/user`).done(),

  // Example:
  // {
  //     nickname: '',
  //     role: 'user',
  //     organization: undefined,
  //     network: undefined,
  // }
  createUser: (user) =>
      Api('POST', `/api/user`)
          .body(user)
          .done(),

  // Example:
  // { url: 'User1@org1.net1.com' }
  deleteUser: (url) =>
      Api('DELETE', `/api/user`)
          .body(url)
          .done(),

  // TODO: change `network` into `networkUrl`
  // Example:
  // { network: 'net1.com' }
  listOrganizationsByNetwork: (network) =>
      Api('GET', `/api/organization`)
          .query(network)
          .done(),


  // ==================== channel ====================
  listChannels: () =>
      Api('GET', `/api/channel`).done(),

  // Example:
  // {
  //     name: 'myChannel',
  //     network: 'net1.com',
  //     peers: [
  //         'peer1.org1.net1.com',
  //         'peer2.org1.net1.com',
  //     ]
  // },
  createChannel: (channel) =>
      Api('POST', `/api/channel`)
          .body(channel)
          .done(),

  // Example:
  // { name: 'myChannel' }
  deleteChannel: (name) =>
      Api('DELETE', `/api/channel`)
          .body(name)
          .done(),

  // TODO: change `network` into `networkUrl`
  // Example:
  // { networkUrl: 'net1.com' }
  listPeersByNetwork: (networkUrl) =>
      Api('GET', `/api/peer`)
          .query({ network: networkUrl })
          .done(),


  // ==================== organization ====================
  listOrganizations: () =>
      Api('GET', `/api/organization`).done(),

  // Example:
  // { peerCount: 2 }
  createOrganization: (organization) =>
      Api('POST', `/api/organization`)
          .body(organization)
          .done(),

  // TODO: change `name` into `url`
  // Example:
  // { name: 'org1.net1.com' }
  deleteOrganization: (name) =>
      Api('DELETE', `/api/organization`)
          .body(name),

  // TODO: change `organization` into `organizationUrl`
  // Example:
  // { organization: 'org1.net1.com' }
  listPeersByOrganization: (organizationUrl) =>
      Api('GET', `/api/peer`)
          .query({ organization: organizationUrl })
          .done(),
}

export default api;

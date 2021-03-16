import Api from "./api";

const api = {
  // ==================== network ====================
  listNetworks: () =>
      Api('GET', `/api/network/`).done(),

  // Example:
  // {
  //     consensus: 'solo',
  //     tlsEnabled: true,
  //     ordererCount: 1,
  //     peerCounts: [ 2, 2 ],
  // }
  createNetwork: (network) =>
      Api('POST', `/api/network/`)
          .body(network)
          .done(),

  // Example:
  // { url: 'net1.com' }
  deleteNetwork: (url) =>
      Api('DELETE', `/api/network`)
          .body({url})
          .done(),


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
          .body({url})
          .done(),

  // Example:
  // { networkUrl: 'net1.com' }
  listOrganizationsByNetwork: (networkUrl) =>
      Api('GET', `/api/organization`)
          .query({networkUrl})
          .done(),


  // ==================== channel ====================
  listChannels: () =>
      Api('GET', `/api/channel`).done(),

  // Example:
  // {
  //     network: 'net1.com',
  //     organizations: [
  //         'org1.net1.com',
  //         'org2.net1.com',
  //     ]
  // },
  createChannel: (channel) =>
      Api('POST', `/api/channel`)
          .body(channel)
          .done(),


  // ==================== organization ====================
  listOrganizations: () =>
      Api('GET', `/api/organization`).done(),

  // Example:
  // {
  //    networkUrl: 'net1.com',
  //    peerCount: 2,
  // }
  createOrganization: (organization) =>
      Api('POST', `/api/organization`)
          .body(organization)
          .done(),

  // TODO: change `name` into `url`
  // Example:
  // { url: 'org1.net1.com' }
  deleteOrganization: (url) =>
      Api('DELETE', `/api/organization`)
          .body({url}),
}

export default api;

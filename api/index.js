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

  // TODO: correct arg name
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

  // TODO: correct arg name
  // Example:
  // { url: 'User1@org1.net1.com' }
  deleteUser: (url) =>
      Api('DELETE', `/api/user`)
          .body({url})
          .done(),

  // TODO: correct arg name
  // Example:
  // { networkUrl: 'net1.com' }
  listOrganizationsByNetwork: (network) =>
      Api('GET', `/api/organization`)
          .query({networkUrl: network})
          .done(),


  // ==================== channel ====================
  listChannels: () =>
      Api('GET', `/api/channel`).done(),

  // TODO: correct args
  // Example:
  // {
  //     network: 'net1.com',
  //     orgs: [
  //         'org1.net1.com',
  //         'org2.net1.com',
  //     ]
  // },
  createChannel: (channel) =>
      Api('POST', `/api/channel`)
          .body(channel)
          .done(),

  // TODO: change `network` into `networkUrl`
  // Example:
  // { networkUrl: 'net1.com' }
  listPeersByNetwork: (networkUrl) =>
      Api('GET', `/api/peer`)
          .query({ networkUrl })
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
  // { url: 'org1.net1.com' }
  deleteOrganization: (url) =>
      Api('DELETE', `/api/organization`)
          .body({url}),

  // TODO: change `organization` into `organizationUrl`
  // Example:
  // { organizationUrl: 'org1.net1.com' }
  listPeersByOrganization: (organizationUrl) =>
      Api('GET', `/api/peer`)
          .query({ organizationUrl })
          .done(),
}

export default api;

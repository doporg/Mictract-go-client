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
  // { url: 'net1.com' }
  deleteNetwork: (url) =>
      Api('DELETE', `/api/network`)
          .body({url})
          .done(),


  // ==================== user ====================
  listUsers: () =>
      Api('GET', `/api/user`).done(),

  // TODO: integrate
  // 1. organization should be full url
  // 2. network should exists
  // Example:
  // {
  //     nickname: '',
  //     role: 'user',
  //     organization: 'org1.net1.com',
  //     network: 'net1.com',
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
  // TODO: integrate
  // 1. network should exists
  // 2. status should be 4 of them
  listChannels: () =>
      Api('GET', `/api/channel`).done(),

  // TODO: integrate
  // 1. `orgs` -> `organizations`
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
  // TODO: integrate
  // can not find this api
  // 看看是不是跟 listOrgsByNetwork 重复了
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

  // TODO: integrate
  // can not find this api
  // Example:
  // { url: 'org1.net1.com' }
  deleteOrganization: (url) =>
      Api('DELETE', `/api/organization`)
          .body({url}),
}

export default api;

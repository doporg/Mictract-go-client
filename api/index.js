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

  // Example:
  // { networkUrl: 'net1.com' }
  listChannelsByNetwork: (networkUrl) =>
      Api('GET', `/api/channel`)
          .query({networkUrl})
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

  // Example:
  // { networkUrl: 'net1.com' }
  listOrganizationsByNetwork: (networkUrl) =>
      Api('GET', `/api/organization`)
          .query({networkUrl})
          .done(),


  // ==================== chaincode ====================
  listChaincodes: () =>
      Api('GET', `/api/chaincode`).done(),

  createChaincode: (chaincode) =>
      Api('POST', `/api/chaincode`)
          .body(chaincode)
          .done(),

  invokeChaincode: (id) =>
      Api('POST', `/api/chaincode/${id}`)
          .done(),


  // ==================== peer ====================

  listPeersByOrganization: (organizationUrl) =>
      Api('GET', `/api/peer`)
          .query({organizationUrl})
          .done(),
}

export default api;

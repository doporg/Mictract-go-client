import Api from "./api";

const api = {
  // ==================== network ====================
  listNetworks: () =>
      Api('GET', `/api/network`).done(),

  createNetwork: (network) =>
      Api('POST', `/api/network`)
          .body(network)
          .done(),

  deleteNetwork: (networkID) =>
      Api('DELETE', `/api/network`)
          .body(networkID)
          .done(),


  // ==================== user ====================
  listUsers: () =>
      Api('GET', `/api/user`).done(),

  createUser: (user) =>
      Api('POST', `/api/user`)
          .body(user)
          .done(),

  deleteUser: (userID) =>
      Api('DELETE', `/api/user`)
          .body(userID)
          .done(),


  // ==================== channel ====================
  listChannels: () =>
      Api('GET', `/api/channel`).done(),

  createChannel: (channel) =>
      Api('POST', `/api/channel`)
          .body(channel)
          .done(),

  listChannelsByNetwork: (networkUrl) =>
      Api('GET', `/api/channel`)
          .query({networkUrl})
          .done(),


  // ==================== organization ====================
  listOrganizations: () =>
      Api('GET', `/api/organization`).done(),

  createOrganization: (organization) =>
      Api('POST', `/api/organization`)
          .body(organization)
          .done(),

  listOrganizationsByNetwork: (networkID) =>
      Api('GET', `/api/organization`)
          .query(networkID)
          .done(),


  // ==================== chaincode ====================
  listChaincodes: () =>
      Api('GET', `/api/chaincode`).done(),

  // TODO: handle the proxy error
  // [HPM] Error occurred while trying to proxy request /api/chaincode from localhost:3000 to http://k8s:32323/ (ECONNRESET) (https://nodejs.org/api/errors.html#errors_common_system_errors)I
  createChaincode: (chaincode) =>
      Api('POST', `/api/chaincode`)
          .body(chaincode)
          .done(),

  invokeChaincode: (id) =>
      Api('POST', `/api/chaincode/${id}`)
          .done(),


  // ==================== peer ====================

  listPeersByOrganization: (organizationID) =>
      Api('GET', `/api/peer`)
          .query(organizationID)
          .done(),
}

export default api;

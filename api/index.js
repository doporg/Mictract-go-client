import Api from "./api";

const api = {
  getItems: (id, name, message) =>
      Api(`/api/item/${id}`)
          .query({name})
          .body({message})
          .done(),

  getNetworks: () =>
      Api(`/api/networks`)
          .done(),
}

export default api;

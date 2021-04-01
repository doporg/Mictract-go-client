import * as R from "ramda";
import networkSource, {createPeers} from "../index";

export default (req, res) => {
    const { method } = req;

    const error = (new Date()) % 2 === 0;

    switch (method) {
        case 'GET':
            switch (true) {
                case req.query.networkUrl !== undefined:
                    // net1.com
                    const { networkUrl } = req.query;
                    const network = networkSource
                        .find(R.propEq('name', networkUrl));

                    res.status(200)
                        .json({payload: network.organizations});
                    break;

                default:
                    // list all orgs
                    let orgs = [];
                    for (const net of networkSource) {
                        const netOrgs = [ ...net.organizations ];
                        netOrgs.forEach(o => o.network = net.name);
                        orgs = [ ...orgs, ...netOrgs];
                    }

                    res.status(200)
                        .json({payload: orgs});
            }
            break;

        case 'POST':
            const organization = req.body;
            const network = networkSource.find(
                R.propEq('name', organization.networkUrl)
            );

            organization.name = `org1.${organization.networkUrl}`
            organization.peers = createPeers(organization.peerCount, organization.name);
            organization.users = [];
            delete organization.networkUrl;
            delete organization.peerCount;

            console.log(organization);
            network.organizations.push(organization);
            res.status(200).json({});

            break;

        case 'DELETE':
            // org1.net1.com
            const { url } = req.query;
            const netUrl = url.split('.').slice(1).join('.');
            const net = networkSource.find(
                R.propEq('name', netUrl)
            );

            const index = net.organizations.findIndex(R.propEq('name', url))
            net.organizations.splice(index, 1);

            res.status(200).json({});
    }
}

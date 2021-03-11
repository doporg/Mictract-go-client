import * as R from "ramda";

const peersByNetwork = (networkUrl) =>
    R.xprod(
        R.range(1, 6),
        R.range(1, 3)
    )
    .map( ([ peerId, orgId ]) => `peer${peerId}.org${orgId}.${networkUrl}` );

const peersByOrganization = (organizationUrl) =>
    R.range(1, 6)
        .map( peerId => `peer${peerId}.${organizationUrl}` );

export default (req, res) => {
    const { method } = req;

    const error = (new Date()) % 2 === 0;

    switch (method) {
        case 'GET':

            switch (true) {
                case req.query.network:
                    // net1.com
                    const { network } = req.query;

                    res.status(200)
                        .json(peersByNetwork(network));
                    break;

                case req.query.organization:
                    // org1.net1.com
                    const { organization } = req.query;

                    res.status(200)
                        .json(peersByOrganization(organization));
                    break;
            }

    }
}

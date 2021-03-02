import * as R from "ramda";

const peers = (networkUrl) =>
    R.xprod(
        R.range(1, 6),
        R.range(1, 3)
    )
    .map( ([ peerId, orgId ]) => `peer${peerId}.org${orgId}.${networkUrl}` );

export default (req, res) => {
    const { method } = req;

    const error = (new Date()) % 2 === 0;

    switch (method) {
        case 'GET':
            // net1.com
            const { network } = req.query;

            res.status(200)
                .json(peers(network));
    }
}

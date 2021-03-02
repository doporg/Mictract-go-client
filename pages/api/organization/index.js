import * as R from "ramda";

const orgs = (networkUrl) => R.range(1, 6)
    .map( orgId => `org${orgId}.${networkUrl}` );

export default (req, res) => {
    const { method } = req;

    const error = (new Date()) % 2 === 0;

    switch (method) {
        case 'GET':
            // net1.com
            const { network } = req.query;

            res.status(200)
                .json(orgs(network));
    }
}

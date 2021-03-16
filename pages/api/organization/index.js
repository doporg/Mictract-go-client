import * as R from "ramda";

const orgs = (networkUrl) => R.range(1, 6)
    .map( orgId => ({ name: `org${orgId}.${networkUrl}` }));

export default (req, res) => {
    const { method } = req;

    const error = (new Date()) % 2 === 0;

    switch (method) {
        case 'GET':
            switch (true) {
                case req.query.networkUrl !== undefined:
                    // net1.com
                    const { networkUrl } = req.query;

                    res.status(200)
                        .json(orgs(networkUrl));
                    break;

                default:
                    // list all orgs
                    const result = R.range(1, 6)
                        .map(id => `net${id}.com`)
                        .flatMap(orgs)
                        .map(({name: orgUrl}) => ({
                            name: orgUrl,
                            peers: R.range(1, 3).map(id => `peer${id}.${orgUrl}`),
                            network: orgUrl.split('.').slice(1).join('.')
                        }))
                        .map((org, key) => ({ ...org, key }));

                    res.status(200)
                        .json(result);
            }
            break;

        case 'POST':
            const { organization } = req.query;

            console.log(organization);
            res.status(200).json({});

            break;

        case 'DELETE':
            // org1.net1.com
            const { url } = req.query;

            res.status(200).json({});

    }
}

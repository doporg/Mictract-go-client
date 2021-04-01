import networkSource from "../index";

export default (req, res) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            switch (true) {
                case req.query.networkUrl !== undefined:
                    // net1.com
                    res.status(200)
                        .json({payload: []});
                    break;

                default:
                    // list all orgs
                    res.status(200)
                        .json({payload: []});
            }
            break;

        case 'POST':
            const chaincode = req.body;
            console.log(chaincode);

            res.status(200).json({});

            break;

        case 'DELETE':
            // org1.net1.com
            res.status(200).json({});
    }
}

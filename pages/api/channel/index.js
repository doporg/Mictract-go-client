import * as R from 'ramda';

const dataSource = [
    {
        name: 'channel1',
        network: 'net1.com',
        organizations: [
            'org1.net1.com',
            'org2.net1.com',
            'org3.net1.com',
            'org4.net1.com',
        ]
    },
    {
        name: 'channel2',
        network: 'net1.com',
        organizations: [
            'org2.net1.com',
            'org3.net1.com',
        ]
    },
    {
        name: 'channel1',
        network: 'net2.com',
        organizations: [
            'org1.net2.com',
            'org2.net2.com',
        ]
    },
].map((net, idx) => ({ ...net, key: idx }));

export default (req, res) => {
    const { method } = req;

    const error = (new Date()) % 2 === 0;

    switch (method) {
        case 'GET':
            res.status(200)
                .json(dataSource);
            break;
        case 'POST':
            const channel = req.body;

            if (error) {
                res.status(400).json({});
            } else {
                channel.key = dataSource.length;
                dataSource.push(channel);

                res.status(200).json({});
            }
            break;
        case 'DELETE':
            const { name } = req.body;

            const index = dataSource.findIndex(R.propEq('name', name));
            dataSource.splice(index, 1);

            res.status(200).json({})
    }
}

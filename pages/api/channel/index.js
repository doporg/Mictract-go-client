const dataSource = [
    {
        name: 'myChannel',
        network: 'net1.com',
        peers: [
            'peer1.org1.net1.com',
            'peer2.org1.net1.com',
            'peer1.org2.net1.com',
            'peer2.org2.net1.com',
            'peer1.org3.net1.com',
            'peer2.org3.net1.com',
            'peer1.org4.net1.com',
            'peer2.org4.net1.com',
        ]
    },
    {
        name: 'anotherChannel',
        network: 'net1.com',
        peers: [
            'peer1.org2.net1.com',
            'peer2.org2.net1.com',
            'peer1.org3.net1.com',
            'peer2.org3.net1.com',
        ]
    },
    {
        name: 'againAnotherChannel',
        network: 'net2.com',
        peers: [
            'peer1.org1.net2.com',
            'peer2.org1.net2.com',
            'peer1.org2.net2.com',
            'peer2.org2.net2.com',
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
            console.log(req.body);
            if (error)
                res.status(400).json({});
            else
                res.status(200).json({});
            break;
        case 'DELETE':
            res.status(200).json({})
    }
}

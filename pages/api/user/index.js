const dataSource = [
    {
        name: 'Admin1@net1.com',
        nickname: 'apple',
        role: 'admin',
        organization: 'orderer.net1.com',
        network: 'net1.com'
    },
    {
        name: 'Admin1@org1.net1.com',
        nickname: 'banana',
        role: 'admin',
        organization: 'org1.net1.com',
        network: 'net1.com'
    },
    {
        name: 'User1@org1.net1.com',
        nickname: 'pear',
        role: 'user',
        organization: 'org1.net1.com',
        network: 'net1.com'
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

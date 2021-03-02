const randomStr = () => Math.random().toString().substr(2, 8);
const dataSource = [
    {
        name: 'net1.com',
        consensus: 'etcdRaft',
        tlsEnabled: 'true',
        orderers: [
            'orderer1.net1.com', 'orderer2.net1.com', 'orderer3.net1.com',
            'orderer4.net1.com', 'orderer5.net1.com', 'orderer6.net1.com',
            'orderer7.net1.com', 'orderer8.net1.com', 'orderer9.net1.com',
            'orderer10.net1.com',
        ],
        organizations: [
            'org1.net1.com', 'org2.net1.com', "org3.net1.com", "org4.net1.com",
            'org5.net1.com', 'org6.net1.com', "org7.net1.com", "org8.net1.com",
            'org9.net1.com', 'org10.net1.com', "org11.net1.com", "org12.net1.com",
            'org13.net1.com', 'org14.net1.com', "org15.net1.com", "org16.net1.com",
            'org17.net1.com', 'org18.net1.com', "org19.net1.com", "org20.net1.com",
        ],
        createTime: '1318781876406',
        status: 'running',
    },
    {
        name: 'net1.com',
        consensus: 'etcdRaft',
        tlsEnabled: 'true',
        orderers: [ 'orderer1.net1.com' ],
        organizations: [ 'org1.net1.com', 'org2.net1.com' ],
        createTime: '1318781876406',
        status: 'stopped',
    },
    {
        name: 'net1.com',
        consensus: 'etcdRaft',
        tlsEnabled: 'true',
        orderers: [ 'orderer1.net1.com' ],
        organizations: [ 'org1.net1.com', 'org2.net1.com' ],
        createTime: '1318781876406',
        status: 'starting',
    },
    {
        name: 'net1.com',
        consensus: 'etcdRaft',
        tlsEnabled: 'true',
        orderers: [ 'orderer1.net1.com' ],
        organizations: [ 'org1.net1.com', 'org2.net1.com' ],
        createTime: '1318781876406',
        status: 'error',
    },
    {
        name: 'net1.com',
        consensus: 'etcdRaft',
        tlsEnabled: 'true',
        orderers: [ 'orderer1.net1.com' ],
        organizations: [ 'org1.net1.com', 'org2.net1.com' ],
        createTime: '1318781876406',
        status: 'running',
    },
    {
        name: 'net1.com',
        consensus: 'etcdRaft',
        tlsEnabled: 'true',
        orderers: [ 'orderer1.net1.com' ],
        organizations: [ 'org1.net1.com', 'org2.net1.com' ],
        createTime: '1318781876406',
        status: 'running',
    },
    {
        name: 'net1.com',
        consensus: 'etcdRaft',
        tlsEnabled: 'true',
        orderers: [ 'orderer1.net1.com' ],
        organizations: [ 'org1.net1.com', 'org2.net1.com' ],
        createTime: '1318781876406',
        status: 'running',
    },
    {
        name: 'net1.com',
        consensus: 'etcdRaft',
        tlsEnabled: 'true',
        orderers: [ 'orderer1.net1.com' ],
        organizations: [ 'org1.net1.com', 'org2.net1.com' ],
        createTime: '1318781876406',
        status: 'running',
    },
].map((net, idx) => ({
    ...net,
    key: idx,
    name: net.name.replace(/1/, randomStr()),
}));

export default (req, res) => {
    const { method } = req;

    const error = (new Date()) % 2 === 0;

    switch (method) {
        case 'GET':
            res.status(200)
                .json(dataSource);
            break;
        case 'POST':
            // TODO: simulate
            console.log(req.body);
            if (error)
                res.status(400).json({});
            else
                res.status(200).json({});
            break;
        case 'DELETE':
            // TODO: simulate
            res.status(200).json({});
    }
}

import * as R from 'ramda';

const createNetwork = (idFrom, idEnd) => {
    const consensus = [ 'solo', 'etcdraft' ];
    const status = [ 'starting', 'running', 'stopped', 'error' ];

    return R.range(idFrom, idEnd+1)
        .map(id => {
            const url = `net${id}.com`;

            return {
                name: url,
                consensus: consensus[id % 2],
                tlsEnabled: true,
                status: status[id % 4],
                createTime: '1318781876406',
                orderers: createOrderers(5, url),
                organizations: createOrganizations(5, url),
                users: [
                    ...createOrgUsers(5, url),
                    ...createOrgAdmins(5, url),
                    ...createOrdererAdmins(5, url),
                ],
                channels: createChannels(5, 5, url),
            }
        });
};

// Example:
// [ 'orderer1.net1.com', 'orderer2.net1.com', 'orderer3.net1.com' ]
export const createOrderers = (ordererCount, networkUrl) =>
    R.range(1, ordererCount+1)
        .map(id => `orderer${id}.${networkUrl}`)

// Example:
// [
//  {
//      name: 'org4.net1.com',
//      peers: [
//          'peer1.org4.net1.com', 'peer2.org4.net1.com', 'peer3.org4.net1.com',
//          'peer4.org4.net1.com', 'peer5.org4.net1.com', 'peer6.org4.net1.com',
//      ],
//      users: [
//          'User1@org4.net1.com', 'User2@org4.net1.com', 'User3@org4.net1.com',
//          'Admin1@org4.net1.com', 'Admin2@org4.net1.com', 'Admin3@org4.net1.com',
//      ],
//  },
// ]
export const createOrganizations = (organizationCount, networkUrl) =>
    R.range(1, organizationCount+1)
        .map(id => {
            const url = `org${id}.${networkUrl}`;

            return {
                name: url,
                peers: createPeers(9, url),
                users: [
                    ...createOrgAdmins(5, url),
                    ...createOrgUsers(5, url),
                ]
            }
        });

// [ 'peer1.org1.net1.com', 'peer2.org1.net1.com' ]
export const createPeers = (peerCount, organizationUrl) =>
    R.range(1, peerCount+1)
        .map(id => `peer${id}.${organizationUrl}`);

// [
//  {
//      name: 'User1@org1.net1.com',
//      role: 'user',
//      nickname: 'pear-net1',
//      organization: 'org1.net1.com',
//  },
// ]
const createOrgUsers = (userCount, organizationUrl) =>
    R.range(1, userCount+1)
        .map(id => ({
            name: `User${id}@${organizationUrl}`,
            role: 'user',
            nickname: `pear-${organizationUrl}`,
            organization: organizationUrl,
        }));

// [
//  {
//      name: 'Admin1@org2.net1.com',
//      role: 'admin',
//      nickname: 'banana-net1',
//      organization: 'org2.net1.com',
//  },
// ]
const createOrgAdmins = (adminCount, organizationUrl) =>
    R.range(1, adminCount+1)
        .map(id => ({
            name: `Admin${id}@${organizationUrl}`,
            role: 'admin',
            nickname: `banana-${organizationUrl}`,
            organization: organizationUrl,
        }));

// [
//  {
//      name: 'Admin1@net1.com',
//      role: 'admin',
//      nickname: 'apple-net1',
//      organization: 'orderer.net1.com',
//  },
// ]
const createOrdererAdmins = (adminCount, networkUrl) =>
    R.range(1, adminCount+1)
        .map(id => ({
            name: `Admin${id}@${networkUrl}`,
            role: 'admin',
            nickname: `banana-${networkUrl}`,
            organization: `orderer.${networkUrl}`,
        }));

// [
//  {
//      name: 'channel1',
//      organizations: [
//          'org1.net1.com',
//      ]
//  },
// ]
export const createChannels = (channelCount, organizationCount, networkUrl) =>
    R.range(1, channelCount+1)
        .map(id => ({
            name: `channel${id}`,
            organizations: R.range(1, organizationCount)
                .map(id => `org${id}.${networkUrl}`),
        }));


const networkSource = [
    {
        name: 'net1.com',
        consensus: 'etcdRaft',
        tlsEnabled: 'true',
        status: 'running',
        createTime: '1318781876406',
        orderers: [
            'orderer1.net1.com', 'orderer2.net1.com', 'orderer3.net1.com',
        ],
        organizations: [
            {
                name: 'org4.net1.com',
                peers: [
                    'peer1.org4.net1.com', 'peer2.org4.net1.com', 'peer3.org4.net1.com',
                ],
                users: [
                    'User1@org4.net1.com', 'User2@org4.net1.com', 'User3@org4.net1.com',
                    'Admin1@org4.net1.com', 'Admin2@org4.net1.com', 'Admin3@org4.net1.com',
                ],
            },
        ],
        users: [
            {
                name: 'Admin1@net1.com',
                role: 'admin',
                nickname: 'apple-net1',
                organization: 'orderer.net1.com',
            },
            {
                name: 'Admin1@org2.net1.com',
                role: 'admin',
                nickname: 'banana-net1',
                organization: 'org2.net1.com',
            },
            {
                name: 'User1@org1.net1.com',
                role: 'user',
                nickname: 'pear-net1',
                organization: 'org1.net1.com',
            },
        ],
        channels: [
            {
                name: 'channel1',
                organizations: [
                    'org1.net1.com',
                ]
            }
        ],
    },
    ...createNetwork(2, 19),
];

export default networkSource;

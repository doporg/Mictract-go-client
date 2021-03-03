import * as R from "ramda";

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

const computeUsername = ({ role, organization: org }) => {
    const count = R.pipe(
        R.filter(
            R.allPass([
                R.propEq('role', role),
                R.propEq('organization', org),
            ])
        ),
        R.length()
    )(dataSource);

    console.log('count', count);

    switch (role) {
        case 'user':
            return `User${count}@${org}`;
        case 'admin':
            return `Admin${count}@${org}`;
    }
};

export default (req, res) => {
    const { method } = req;

    const error = (new Date()) % 2 === 0;

    switch (method) {
        case 'GET':
            res.status(200)
                .json(dataSource);
            break;
        case 'POST':
            const user = req.body;
            console.log(user);

            if (error) {
                res.status(400).json({});
            } else {
                user.key = dataSource.length;
                user.name = computeUsername(user);
                console.log(user);
                dataSource.push(user);

                res.status(200).json({});
            }
            break;
        case 'DELETE':
            const { url: name } = req.body;

            const index = dataSource.findIndex(R.propEq('name', name));
            dataSource.splice(index, 1);

            res.status(200).json({})
    }
}

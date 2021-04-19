import * as R from "ramda";
import networkSource from "../index";

const computeUsername = (user) => {
    let org = user.organization;
    if (org.startsWith('orderer'))
        org = org.split('.').slice(1).join('.');

    switch (user.role) {
        case 'user':
            return `User1@${org}`;
        case 'admin':
            return `Admin1@${org}`;
    }
};

export default (req, res) => {
    const { method } = req;

    const error = (new Date()) % 2 === 0;

    switch (method) {
        case 'GET':
            let users = [];
            for (const net of networkSource) {
                const netUsers = [ ...net.users ];
                netUsers.forEach(user => user.network = net.name);
                users = [ ...users, ...netUsers];
            }

            res.status(200)
                .json({payload: users});
            break;

        case 'POST':
            const user = req.body;
            console.log(user);

            if (error) {
                res.status(400).json({});
            } else {
                const network = networkSource
                    .find(R.propEq('name', user.network));

                const organization = network.organizations
                    .find(R.propEq('name', user.organization));

                user.name = computeUsername(user);
                delete user.network;

                console.log(user);
                network.users.push(user);
                organization.users.push(user);

                res.status(200).json({});
            }
            break;

        case 'DELETE':
            res.status(200).json({})
    }
}

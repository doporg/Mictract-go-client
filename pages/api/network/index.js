import * as R from "ramda";
import networkSource, {createChannels, createOrderers, createOrganizations} from "../index";

export default (req, res) => {
    const { method } = req;

    const error = (new Date()) % 2 === 0;

    switch (method) {
        case 'GET':
            res.status(200)
                .json({payload: networkSource});
            break;

        case 'POST':
            const network = req.body;

            console.log(network);
            if (error) {
                res.status(400).json({});
            } else {
                network.name = `net${networkSource.length+1}.com`;
                network.status = 'running';
                network.createTime = '1318781876406';
                network.orderers = createOrderers(network.ordererCount, network.name);
                // ignore peer count for each organization
                network.organizations = createOrganizations(network.peerCounts.length, network.name);
                network.users = [];
                network.channels = createChannels(1, network.organizations.length, network.name);
                delete network.ordererCount;
                delete network.peerCounts;

                networkSource.push(network);
                console.log(network);

                res.status(200).json({});
            }
            break;

        case 'DELETE':
            const { url } = req.body;

            const index = networkSource.findIndex(R.propEq('name', url));
            networkSource.splice(index, 1);

            res.status(200).json({});
    }
}

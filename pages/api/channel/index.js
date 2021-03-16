import * as R from 'ramda';
import networkSource from "../index";

export default (req, res) => {
    const { method } = req;

    const error = (new Date()) % 2 === 0;

    switch (method) {
        case 'GET':
            let channels = [];
            for (const net of networkSource) {
                const netChannel = [ ...net.channels ];
                netChannel.forEach(c => c.network = net.name);
                channels = [ ...channels, ...netChannel];
            }

            res.status(200)
                .json(channels);
            break;

        case 'POST':
            const channel = req.body;

            if (error) {
                res.status(400).json({});
            } else {
                const network = networkSource
                    .find(R.propEq('name', channel.network));

                delete channel['network'];
                channel.name = `channel${network.channels.length+1}`;
                network.channels.push(channel);

                res.status(200).json({});
            }
            break;
    }
}

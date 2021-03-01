export default (req, res) => {
    const { method } = req;

    switch (method) {
        case 'DELETE':
            res.status(200).json({})
            break;
        default:
            res.status(400).json({})
    }
}

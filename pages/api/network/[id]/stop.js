export default (req, res) => {
    const { method } = req;

    if (method === 'POST')
        res.status(200).json({})
    else
        res.status(400).json({})
}

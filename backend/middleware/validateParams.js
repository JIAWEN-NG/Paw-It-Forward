module.exports = (req, res, next) => {
    const { userId, otherUserId } = req.params;
    console.log(`Middleware check: userId=${userId}, otherUserId=${otherUserId}`);

    // If either parameter is missing, log it and return a 400 response
    if (!userId) {
        console.log('userId is missing');
        return res.status(400).json({ error: 'Missing userId in the request' });
    }

    if (!otherUserId) {
        console.log('otherUserId is missing');
        return res.status(400).json({ error: 'Missing otherUserId in the request' });
    }

    console.log('Both parameters are present');
    next();
};

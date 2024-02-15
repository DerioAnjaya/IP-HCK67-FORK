const authorizationAdminOnly = async (req, res, next) => {
    try {
        if (req.user.role === 'Admin') {
            throw {name: 'Forbidden'}
        }
        next()
    } catch (error) {
        console.log(error);
        next(error)
    }
}

module.exports = { authorizationAdminOnly }
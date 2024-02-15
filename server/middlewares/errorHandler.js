const errorHandler = (error, req, res, next) => {
    switch (error.name) {
        case 'SequelizeValidationError':
        case 'SequelizeUniqueConstraintError':
            res.status(400).json({ message: error.errors[0].message })
            break;
        case 'error not found':
            res.status(404).json({ message: 'Data not found' })
            break;
        case 'cant login':
            res.status(401).json({ message: 'user not found' })
            break;
        case 'Forbidden':
            res.status(403).json({ message: 'Forbidden' })
            break;
        case 'Email cannot empty':
            res.status(400).json({ message: 'Email cannot empty' })
            break;
        case 'Password cannot empty':
            res.status(400).json({ message: 'Password cannot empty' })
            break;
        case 'Unauthorized':
        case 'JsonWebTokenError':
            res.status(401).json({ message: 'Error authentication' })
            break;
        case 'Please upload an image':
            res.status(400).json({ message: 'Please upload an image' })
            break;
        default:
            res.status(500).json({ message: 'Internal server error' })
            break;
    }
}

module.exports = { errorHandler }
// Send success response
const sendResponse = (res, code, data) => {
    return res.status(code).send(data)
}

// Send error response
const sendErrorResponse = (res, code, error) => {
    return res.status(code).send(error)
}

module.exports = {
    sendResponse,
    sendErrorResponse
}
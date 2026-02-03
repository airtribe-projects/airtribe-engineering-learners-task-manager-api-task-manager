// Centralized error handling middleware
module.exports =
    (err,req,res,next) => {
        console.error(err)

        const statusCode = err.statusCode || 500;
        const message = err.message || "Internal Server Error"
        const payload = {success:false ,statusCode, message}

        if(process.env.node_MODE === "development") payload.stack = err.stack;

        res.status(statusCode).json(payload)
    }
const inputValidation = (req,res,next) => {

    const {title, description, priorityLevel, taskState,completed} = req.body;

    if(!title || !description || typeof title !== 'string' || typeof description !== 'string' ){
        const err = new Error(`Provide correct input`)
        err.statusCode = 400
        throw err
    }

    if (!completed || typeof completed !== 'boolean') {
        const err = new Error(`Provide correct input`)
        err.statusCode = 400
        throw err
    }



    if(priorityLevel){
        const lowerCasePriority = priorityLevel.toLocaleUpperCase()
        if(lowerCasePriority !== "LOW" && lowerCasePriority !== "MEDIUM" && lowerCasePriority !== "HIGH"){
            const err = new Error(`Provide correct input`)
            err.statusCode = 400
            throw err
        }
        req.body.priority = lowerCasePriority
    }

    if(taskState){
        const upperCaseTaskState = taskState.toLocaleUpperCase()
        if(upperCaseTaskState !== "TO_DO" && upperCaseTaskState !== "IN_PROGRESS" && upperCaseTaskState !== "BLOCKED" && upperCaseTaskState !== "COMPLETED"){
            const err = new Error(`Provide correct input`)
            err.statusCode = 400
            throw err
        }
        req.body.priority = upperCaseTaskState
    }



    next()

}

module.exports = {inputValidation}
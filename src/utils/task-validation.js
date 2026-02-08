
function isValidTask(title,description,completed){
    if(
        typeof title !== 'string' || title.trim() === ''||
       typeof description !== 'string' || description.trim() === ''||
       typeof completed !=="boolean"
    ){
    return false;
}
return true;
};

module.exports={
    isValidTask
}
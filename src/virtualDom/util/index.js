let StateEnums = {
    ChangeProps: 'CHANGE',
    Replace:'REPLACE',
    Insert: 'INSERT',
    Move: 'MOVE'
}
function isString(obj){
    if(Object.prototype.toString.call(obj) == "[object String]"){
        return true;
    }
    return false;
}

function move(){

}

export {
    StateEnums,
    isString,
    move
}
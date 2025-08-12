const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ROLES = {
    ORGANIZER: 'organizer',
    ATTENDEE: 'atendee'
}

const users = [];

const rounds = 5;

const registerNewUser = async(user) =>{
    if(!Object.values(ROLES).includes(user.role)){
        throw new Error(`Invalid Role`);
    }
    if(users.some(u => u.email === user.email)){
        throw new Error(`User ${user.email} already Exists`);
    }
    user.password = await bcrypt.hashSync(user.password, rounds)

    users.push(user);
    return user;
}

const loginUser = async(email,password) =>{
    const requestedUser = users.find((u) => email === u.email);
    if(!requestedUser){
        throw new Error(`User not found`)
    }

    const isSamePassword = await bcrypt.compare(password,requestedUser.password);

    if(!isSamePassword){
        throw new Error('Incorrect Password');
    }

    const token = jwt.sign({email: requestedUser.email, role: requestedUser.role}, process.env.JWT_SECRET, {expiresIn:'1h'})
    return {status: 'ok', token}
}

module.exports = {registerNewUser,loginUser,users}
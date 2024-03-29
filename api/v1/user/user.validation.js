const {Validator} = require('node-input-validator')

exports.create = async (obj)=>{
    const rules = {
        firstName:"required|string|minLength:1",
        lastName:"required|string|minLength:1",
        email:"required|email",
        password:"required|string|minLength:6",
    }
    const validator = new Validator(obj, rules)
    const passed = await validator.check()
    const errors = await validator.errors
    return {passed, errors}
}

exports.login = async(obj)=>{
    const rules = {
        email:"required|email",
        password:"required|string|minLength:6",
    }
    const validator = new Validator(obj, rules)
    const passed = await validator.check()
    const errors = await validator.errors
    return {passed, errors}
}

exports.update = async (obj)=>{
    const rules = {
        firstName:"required|string|minLength:1",
        lastName:"required|string|minLength:1",
        email:"required|email",
        avatar:"required|string|minLength:1"
    }
    const validator = new Validator(obj, rules)
    const passed = await validator.check()
    const errors = await validator.errors
    return {passed, errors}
}

exports.patch = async (obj)=>{
    const rules = {
        firstName:"string|minLength:1",
        lastName:"string|minLength:1",
        email:"email",
        avatar:"string|minLength:1"
    }
    const validator = new Validator(obj, rules)
    const passed = await validator.check()
    const errors = await validator.errors
    return {passed, errors}
}

exports.changePassword = async (obj)=>{
    const rules = {
        oldPassword:"required|string|minLength:6",
        newPassword:"required|string|minLength:6"
    }
    const validator = new Validator(obj, rules)
    const passed = await validator.check()
    const errors = await validator.errors
    return {passed, errors}
}
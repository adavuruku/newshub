const {Validator} = require('node-input-validator')

exports.create = async (obj)=>{
    const rules = {
        post:"required|string|minLength:1",
        body:"required|string|minLength:1"
    }
    const validator = new Validator(obj, rules)
    const passed = await validator.check()
    const errors = await validator.errors
    return {passed, errors}
}

exports.update = async (obj)=>{
    const rules = {
        body:"required|string|minLength:1"
    }
    const validator = new Validator(obj, rules)
    const passed = await validator.check()
    const errors = await validator.errors
    return {passed, errors}
}

exports.patch = async (obj)=>{
    const rules = {
        body:"string|minLength:1",
    }
    const validator = new Validator(obj, rules)
    const passed = await validator.check()
    const errors = await validator.errors
    return {passed, errors}
}
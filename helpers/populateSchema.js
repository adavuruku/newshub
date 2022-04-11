exports.populatSchema = {
    post:{
        user:{
            relationship:'->',
            relationshiplabel:':CREATED_BY'
        },
        comment:{
            relationship:'->',
            relationshiplabel:'COMMENTS'
        }
    },
    user:{
        post:{
            relationship:'<-',
            relationshiplabel:'CREATED_BY'
        }
    },
    comment:{
        post:{
            relationship:'<-',
            relationshiplabel:'CREATED_BY'
        },
        user:{
            relationship:'->',
            relationshiplabel:':CREATED_BY'
        },
    }
}

exports.nodeNames = {
    comment:'Comment',
    user:'User',
    post:'Post',
}
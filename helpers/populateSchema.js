exports.populatSchema = {
    post:{
        user:{
            nodeName:'User',
            relationship:'->',
            relationshiplabel:':CREATED_BY'
        },
        comment:{
            nodeName:'Comment',
            relationship:'->',
            relationshiplabel:'COMMENTS'
        }
    },
    user:{
        post:{
            relationship:'<-',
            relationshiplabel:'CREATED_BY'
        },
        comment:{
            relationship:'<-',
            relationshiplabel:'CREATED_BY'
        }
    }
}

exports.nodeNames = {
    comment:'Comment',
    user:'User',
    post:'Post',
}
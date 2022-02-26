var db = require("../config/connection");
var collection = require("../config/collections");
var bcrypt = require('bcrypt');
const { response } = require("express");
module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password = await bcrypt.hash(userData.Password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data)
                console.log(userData)
            })
        })
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        response.user=user
                        response.status=true
                        resolve(response)

                    }else{
                        console.log("Fail")
                        resolve({status:false})
                    }
                })
            }else{
                console.log("wrong email")
                resolve({status:false})
            }
        })
    }

}
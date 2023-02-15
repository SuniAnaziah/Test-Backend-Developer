const { PrismaClient } = require('@prisma/client')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const { getUser } = require('../utils/helper')


const prisma = new PrismaClient()


const register = async (req,res)=>{
  let {role, email, password} = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({data: {role, email, password: hashedPassword}})

  const expiresIn = 2*24*3600 //2 days 

  const token = jwt.sign({userId: user.id}, process.env.TOKEN_SECRET, { expiresIn});

  createProfile(user)

  return res.status(200).json({user: {id: user.id, role, email}, token})
}

const login = async (req,res)=>{
  let {role, email, password} = req.body

  const users = await prisma.user.findMany({
    where: {
      AND: [
        {role},
        {email}
      ]
    }
  })

  if (users.length > 0 ){
    let user = users[0]
    const valid = await bcrypt.compare(password, user.password)
    if(!valid){
      return res.status(400).json("invalid credentials")
    }else{
      const expiresIn = 2*24*3600 //2 days 

      const token = jwt.sign({userId: user.id}, process.env.TOKEN_SECRET, { expiresIn});
      const {id, role, email} = user

      createProfile(user)

      return res.status(200).json({user: {id, role, email}, token})
    }
  }else{
    return res.status(400).json("invalid credentials")
  }
}

const createProfile = async(user)=>{
  const getProfiles = await prisma.profile.findMany({
    where: {
      userId: user.id
    }
  })

  if (getProfiles.length === 0){
    try{
      const profile = await prisma.profile.create({
        data : {
          userId: user.id
        }
      })
    }catch(err){
      console.log(err)
    }
  }
}

const changePassword = async (req, res) => {
  let {currentPassword, newPassword, confirmNewPassword} = req.body
  let {userId} = getUser(req)

  const users = await prisma.user.findMany({
      where: {
        id: userId
      }
  })

  if(users.length > 0){
    let user = users[0]
    const valid = await bcrypt.compare(currentPassword, user.password)
    const inputPassword = newPassword === confirmNewPassword ? true : false
    if(valid){
      if(inputPassword){
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        const changePassw = await prisma.user.update({
          data:{
            email: user.email,
            password: hashedPassword
          },
          where: {
            id: userId
          }
        })
        return res.status(200).json(changePassw)
      } else {
        return res.status(400).json("New Password and Confirm New Password doesn't match!")
      }
    }else{
      return res.status(400).json("Current Password doesn't match")
    }
  }else{
    return res.status(400).json("invalid credential")
  }
}

// production only
const getAllUser = async (req, res) => {
  const user = await prisma.user.findMany()

  return res.status(200).json(user)
}
// end production only


module.exports ={
  register, login,
  getAllUser,
  changePassword
}
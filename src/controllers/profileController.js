const { PrismaClient } = require('@prisma/client')
const { getUser } = require('../utils/helper')
const prisma = new PrismaClient()

const getProfile = async(req,res)=>{
  let {userId} = getUser(req)

  console.log(userId)
  
  try{
    const profil = await prisma.profile.findFirstOrThrow({
      where:{
        userId
      }
    })
    res.json(profil)
  }catch(err){
    res.json(err)
  }
}

const updateProfile = async (req, res)=>{
  let {userId} = getUser(req)
  let {nama, alamat, phone}= req.body 


  try{
    const profil = await prisma.profile.update({
      data:{
        nama,
        alamat,
        phone
      },
      where: {
        userId
      }
    })
    
    res.json(profil)
  }catch(err){
    res.json({err})
  }
}

module.exports ={
  getProfile,
  updateProfile
}
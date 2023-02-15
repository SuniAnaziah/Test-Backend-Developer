const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const createBiodata = async (req,res) => {
    let {nama, alamat, jenis_kelamin, tanggal_lahir, phone} = req.body

    try {
        const biodata = await prisma.biodata.create({
            data: {nama, alamat, jenis_kelamin, tanggal_lahir, phone}
        })
        return res.status(200).json(biodata)
    }catch(err) {
        return res.status(404).json({error: err})
    }
}


module.exports = createBiodata
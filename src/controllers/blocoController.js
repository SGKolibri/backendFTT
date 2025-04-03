import mongoose from "mongoose";
import Bloco from '../models/blocoModel.js'

async function CreateBloco(request, response) {
    const { nome, descricao } = request.body;


    if(!descricao) {
        return response.status(400).json({erro: "Preencha a descrição sobre o bloco."})
    }
    if(!nome) {
        return response.status(400).json({erro: "Preencha o nome do bloco."})
    }

    if (!/^[A-Z]$/.test(nome)) {
        return response.status(400).json({ erro: "O nome do bloco deve ser uma única letra de A a Z." });
    }

    try {
    const blocoExists = await Bloco.findOne({nome, descricao})
    if(blocoExists) {
        return response.status(400).json({erro: "Bloco já existe"})
    }

        const bloco = await Bloco.create({nome, descricao})
        return response.status(201).json(bloco)
    } catch(error) {
        console.error("Erro ao criar o bloco: ${error.message}", error)
        return response.status(500).json({ erro: "Erro ao criar o bloco"})
    }
}

async function GetBlocos(request, response) {
    const { page = 1, limit = 10} = request.query

    try {
        const blocos = await Bloco.find()
        .limit(limit * 1) 
        .skip((page - 1) * limit) 
        .exec()
        const total = await Bloco.countDocuments()

        return response.status(200).json({
            blocos,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
        })
    } catch(error) {
        console.error("Erro ao buscar blocos: ${error.message}", error)
        return response.status(500).json({ erro: "Erro ao buscar blocos"})
    }
}

async function DeleteBloco(request, response) {
    const id = request.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(400).json({ erro: "ID inválido" });
    }    

    try {
    const blocoExists = await Bloco.findById({_id: id})
    if(!blocoExists) {
        return response.status(404).json({message: "Bloco não encontrado"})
    }

        await Bloco.findByIdAndDelete({_id: id})
        return response.status(200).json({message: "Bloco deletado com sucesso"})
    } catch(error) {
        console.error("Erro ao deletar o bloco: ${error.message}", error)
       return response.status(500).json({ erro: "Erro ao deletar o bloco" })
    }
}

export {CreateBloco, GetBlocos, DeleteBloco}
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function name(
    req: NextApiRequest,
    res: NextApiResponse
) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE');
    if (req.method === 'GET'){
        try{
            const Mesas = await prisma.Reservas.findMany();
            res.status(200).json(Mesas)
        }catch(error){
            res.status(500).json({message:'Error al obtener las Reservas', error});
        }
    } else if (req.method === 'POST'){
        const { id_cliente, id_mesa, fecha_hora, numero_persona_reservas, id_confirmacion } = req.body;
        if (!id_cliente || !id_mesa || !fecha_hora || !numero_persona_reservas || !id_confirmacion){
            return res.status(400).json({message: 'Faltan campos requeridos'})
        }

        try{
            const newReserva = await prisma.Reservas.create({
                data: {
                    id_cliente: parseInt(id_cliente),
                    id_mesa: parseInt(id_mesa),
                    fecha_hora: new Date(),
                    numero_persona_reservas: parseInt(numero_persona_reservas),
                    id_confirmacion: parseInt(id_confirmacion)

                },
            });
            res.status(201).json(newReserva);
        }catch(error){
            res.status(500).json({message: 'Error al crear la mesa', error});
        }
    }else if(req.method === 'PUT'){
        const {id_reservas, id_cliente, id_mesa, fecha_hora, numero_persona_reservas, id_confirmacion } = req.body;
        if (!id_cliente || !id_mesa || !fecha_hora || !numero_persona_reservas || !id_confirmacion){
            return res.status(400).json({message: 'Faltan campos requeridos'})
        }

        try{
            const updateReserva = await prisma.Reservas.update({
                where: {id_reservas: parseInt(id_reservas)},
                data: {
                    id_cliente: parseInt(id_cliente),
                    id_mesa: parseInt(id_mesa),
                    fecha_hora: new Date(),
                    numero_persona_reservas: parseInt(numero_persona_reservas),
                    id_confirmacion: parseInt(id_confirmacion)
                },
            });
            res.status(201).json(updateReserva);
        }catch(error){
            res.status(500).json({message: 'Error al actualizar la Reserva', error});
        }

    } else if(req.method === 'DELETE'){
        const {id_reservas} = req.query;

        if (!id_reservas){
            return res.status(400).json({message: 'El id de reserva es requerido'});
        }

        try{
            //esto me va a servir para eliminar el producto por ID
            const deleteReserva = await prisma.Reservas.delete({
                where: {id_reservas: parseInt(id_reservas as string)},
            });
            res.status(200).json(deleteReserva);
        }catch (error){
            res.status(500).json({message: 'Error al eliminar la Reserva', error});
        }
    } else {
        res.status(405).json({message: 'Método no permitido'});
    }

}
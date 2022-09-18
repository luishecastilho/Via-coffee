import express from 'express';
import cors from 'cors';

import { PrismaClient } from '@prisma/client';


const app = express();
app.use(express.json());
app.use(cors({
    //origin: 'https://sitedoluis.com'
}));

const prisma = new PrismaClient({
    log: ['query']
});

/**
 * CLAN
 */
// lista clans
app.get("/clans", async (request, response) => {
    const clans = await prisma.clan.findMany({
        include: {
            _count: {
                select: {
                    users: true
                }
            }
        }
    });

    return response.status(201).json(clans);
});

// lista users do clan
app.get("/clans/:id/users", async (request, response) => {

    const clanId = request.params.id;

    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            createdAt: true
        },
        where: {
            clanId,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return response.status(201).json(users);
});

// lista clan específico
app.get("/clans/:id", async (request, response) => {

    const id = request.params.id;

    const clan = await prisma.clan.findUnique({
        where: {
            id,
        }
    })

    return response.status(201).json(clan);
});

// cria clan
app.post("/clans", async (request, response) => {
    const body: any = request.body;

    const clan = await prisma.clan.create({
        data: body
    })

    return response.status(201).json(clan);
});

// cria user atribuido à clan
app.post("/clans/:id/users", async (request, response) => {

    const clanId = request.params.id;
    const body: any = request.body;
    body.clanId = clanId;

    const user = await prisma.user.create({
        data: body
    })

    return response.status(201).json(user);
});
/**
 * 
 */

/**
 * USER
 */
// lista purchases do user
app.get("/users/:id/purchases", async (request, response) => {

    const userId = request.params.id;

    const purchases = await prisma.purchase.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return response.status(201).json(purchases);
});

// lista brews do user
app.get("/users/:id/brews", async (request, response) => {

    const userId = request.params.id;

    const brews = await prisma.brew.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return response.status(201).json(brews);
});

// lista user específico
app.get("/users/:id", async (request, response) => {

    const id = request.params.id;

    const user = await prisma.user.findUnique({
        where: {
            id,
        }
    })

    return response.status(201).json(user);
});

// cria purchase atribuido à user
app.post("/users/:id/purchases", async (request, response) => {

    const userId = request.params.id;
    const body: any = request.body;
    body.userId = userId;

    /**
     * handle picture
     */
    
    const purchase = await prisma.purchase.create({
        data: body
    })

    return response.status(201).json(purchase);
});

// cria brew atribuido à user
app.post("/users/:id/brews", async (request, response) => {

    const userId = request.params.id;
    const body: any = request.body;
    body.userId = userId;

    const brew = await prisma.brew.create({
        data: body
    })

    return response.status(201).json(brew);
});

app.listen(3333)
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
const saltRounds = 10;

const router = Router();
const prisma = new PrismaClient();

// User CRUD
// create user and encrypt password
router.post('/create', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'Missing email or password' });
        return;
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(password, salt);

    // const alreadyExists = !!await prisma.user.findUnique({
    //     where: { email: email },
    // });
   
    // if(alreadyExists) {
    //     res.status(400).json({ message: 'User already exists' });
    //     return;
    // }
    try {
        const result = await prisma.user.create({
            data: {
                email,
                password: passwordHash,
            },
        });       
       res.status(200).json({ message: `User created`, data: {id: result.id, email: result.email} });
    } catch (error) {
        console.log('error', error)
        res.status(400).json({ message: 'User already exists' });
    }
    
});

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    if(!userId) {
        res.status(400).json({ message: 'Missing id' });
        return;
    }
    const result = await prisma.user.findUnique({
        where: { id: Number(userId) },
    });
    result && res.status(200).json({ message: `User found`, data: {id: result.id, email: result.email} });
});

router.put('/:userId/update', async (req, res) => {
    const { userId } = req.params;
    if(!userId) {
        res.status(400).json({ message: 'Missing id' });
        return;
    }

    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'Missing email or password' });
        return;
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(password, salt);

    const result = await prisma.user.update({
        where: { id: Number(userId) },
        data: {
            email,
            password: passwordHash,
        },
    });

   result && res.status(200).json({ message: `User updated`, data: {id: result.id, email: result.email} });

});

router.delete('/:userId/delete', async (req, res) => {
    const { userId } = req.params;
    if(!userId) {
        res.status(400).json({ message: 'Missing id' });
        return;
    }
    const result = await prisma.user.delete({
        where: { id: Number(userId) },
    });
    result && res.status(200).json({ message: `User deleted`, data: {id: result.id, email: result.email} });
});

// login

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: 'Missing email or password' });
        return;
    }
    const result = await prisma.user.findUnique({
        where: { email: email },
    });
    if(!result) {
        res.status(400).json({ message: 'User not found' });
        return;
    }

    const match = bcrypt.compareSync(password, result.password);
    if(!match) {
        res.status(400).json({ message: 'Wrong password' });
        return;
    }

    res.status(200).json({ message: `User logged in`, data: {id: result.id, email: result.email} });
});

export default router;
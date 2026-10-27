const express= require('express');
const app= express();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
app.use(express.json());

// Create a new student
app.post('/students', async (req, res) => {
  const { name, age, email, gender } = req.body;

  try {
    const student = await prisma.student.create({
      data: {
        name,
        age,
        email,
        gender
      }
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

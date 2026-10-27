const express= require('express');
const app= express();
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const databaseUrl = new URL(process.env.DATABASE_URL);
const adapter = new PrismaMariaDb({
  host: databaseUrl.hostname,
  port: Number(databaseUrl.port || 3306),
  user: decodeURIComponent(databaseUrl.username),
  password: decodeURIComponent(databaseUrl.password),
  database: databaseUrl.pathname.slice(1)
});
const prisma = new PrismaClient({ adapter });
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Student API is running' });
});

// Create a new student
app.post('/students', async (req, res) => {
  const { name, age, email,gender } = req.body;

  if (typeof gender !== 'string' || !gender.trim()) {
    return res.status(400).json({ error: 'gender is required' });
  }

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



app.get('/students', async (req, res) => {
try {
const students = await prisma.student.findMany();
 res.json(students);
 } catch (error) {
 res.status(500).json({ error: error.message });
 }
});


app.put('/students/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age, email, gender } = req.body;

    try {
        const student = await prisma.student.update({
            where: {
                id: Number(id)
            },
            data: {
                name,
                age,
                email,
                gender
            }
        });

        res.json(student);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.delete('/students/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const student = await prisma.student.delete({
            where: {
                id: Number(id)
            }
        });

        res.json(student);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.listen(3000, () => {
    console.log("Server running on port 3000");
});

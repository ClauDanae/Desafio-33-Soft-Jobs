require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require("jsonwebtoken");
//const cors = require('cors');
const { registrarUsuarios, getUser, verificarCredenciales } = require('./consultas');

app.listen(3000, console.log("¡Servidor encendido en el puerto 3000!"));
//app.use(cors());
app.use(express.json());

app.post("/usuarios", async (req, res) => {
    try {
        const user = req.body;
        await registrarUsuarios(user);
        res.send("Usuario creado con éxito");
    } catch (error) {
        res.status(500).send(error)
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        await verificarCredenciales(email, password);
        const token = jwt.sign({ email }, process.env.JWT_SECRET);
        res.send(token)
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send(error)
    }
});

app.get("/usuarios", async (req, res) => {
    try {
        const { id } = req.params;
        const Authorization = req.header("Authorization");
        const token = Authorization.split("Bearer ")[1];
        jwt.verify(token, process.env.JWT_SECRET);
        const { email } = jwt.decode(token);
        await getUser(id);
        res.send(`Hey, ${email}! has sido autenticado`);
    } catch (error) {
        res.status(error.code || 500).send(error)
    }
})



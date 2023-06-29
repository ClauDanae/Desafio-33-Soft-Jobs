const { Pool } = require('pg')
require('dotenv').config()
const bcrypt = require('bcryptjs')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'softjobs',
    allowExitOnIdle: true
})

const getUser = async () => {
    const { rows: eventos } = await pool.query("SELECT * FROM eventos WHERE id = $1 ")
    return eventos
};

const registrarUsuarios = async (user) => {
    let { email, password, rol, lenguage } = user;
    const passwordEncriptada = bcrypt.hashSync(password);
    password = passwordEncriptada;
    const values = [email, passwordEncriptada, rol, lenguage];
    const consulta = "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)";
    await pool.query(consulta, values)
};


const verificarCredenciales = async (email, password) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1 AND password = $2"
    const values = [email, password];
    const { rowCount } = await pool.query(consulta, values);
    if (!rowCount)
        throw {
            code: 404,
            message: "No se encontró tu credencial 🥺"
        };
    return true;
};

module.exports = { verificarCredenciales, registrarUsuarios, getUser }
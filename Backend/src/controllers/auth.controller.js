const db = require("../config/db");
const bcrypt = require('bcrypt');

class AuthController {
    // Registro de un nuevo usuario
    async registrar(userData) {
        try {
            // Verificar si el email ya está registrado
            const [emailExistente] = await db.query(`SELECT email FROM usuarios WHERE email = ?`, [userData.email]);
            
            if (emailExistente.length > 0) {
                return {
                    success: false,
                    message: 'El email ya está registrado'
                };
            }

            // Encriptar la contraseña antes de guardarla
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(userData.clave, saltRounds);

            // Crear el objeto de usuario con la contraseña encriptada
            const usuario = {
                ...userData,
                clave: hashedPassword
            };

            // Insertar el nuevo usuario en la base de datos
            const [resultado] = await db.query(`INSERT INTO usuarios SET ?`, [usuario]);

            return { 
                success: true,
                message: 'Usuario registrado exitosamente',
                userId: resultado.insertId 
            };
        } catch (error) {
            console.error('Error en el registro de usuario:', error);
            throw error;
        }
    }

    // inicio de sesión de usuario
    async iniciarSesión(email, clave) {
        try {
            // Buscar el usuario por email
            const [usuarios] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);

            if (usuarios.length === 0) {
                return {
                    success: false,
                    message: 'Credenciales inválidas'
                };
            }

            const usuario = usuarios[0];

            // Verificar la contraseña
            const passwordMatch = await bcrypt.compare(clave, usuario.clave);

            if (!passwordMatch) {
                return {
                    success: false,
                    message: 'Credenciales inválidas'
                };
            }

            // Crear un  obejto con los datos del usuario sin la contraseña
            const usuarioData = {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol
            };

            return {
                success: true,
                message: 'Inicio de sesión exitoso',
                user: usuarioData
            };
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            throw error;
        }
    }

    // Verificar si un usuario está autenticado
    async verificarUsuario(userId) {
        try {
            const [usuarios] = await db.query(`SELECT id_usuario, nombre, apellido, email, rol FROM usuarios WHERE id_usuario = ?`, [userId]);

            if (usuarios.length === 0) {
                return {
                    success: false,
                    message: 'Usuario no encontrado'
                };
            }

            return {
                success: true,
                user: usuarios[0]
            };
        } catch (error) {
            console.error('Error al verificar el usuario:', error);
            throw error;
        }
    }
}

module.exports = new AuthController();
// Variables globales
const API_URL = 'http://localhost:3000/api';
let productos = [];

// Elementos del DOM
const productoForm = document.getElementById('formProducto');
const tablaPersonasBody = document.getElementById('tablaPersonasBody');
const contenedorCards = document.getElementById('contenedorCards');
const imagenInput = document.getElementById('imagen');
const previewImagen = document.getElementById('prevImagen');

// Eventos principales
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si el usuario está autenticado
    verificarAutenticacion();

    // Mostrar nombre del usuario si está autenticado
    const usuarioNombre = localStorage.getItem('usuarioNombre');
    const usuarioDescripcion = localStorage.getItem('usuarioDescripcion');

    if (usuarioNombre && usuarioDescripcion) {
        const divUsuario = document.createElement('div');
        divUsuario.innerHTML = `
            <p>Bienvenido, ${usuarioNombre} (${usuarioDescripcion} |
                <a href="#" id="btnCerrarSesion">Cerrar sesión</a>
            </p>
        `;
        document.body.insertBefore(divUsuario, document.body.firstChild);

        // Agregar listener para cerrar sesión
        document.getElementById('btnCerrarSesion').addEventListener('click', cerrarSesion);
    }

    cargaProductos();
});

productoForm.addEventListener('submit', manejarSubmit);
btnCancelar.addEventListener('click', limpiarFormulario);
imagenInput.addEventListener('change', manejarImagen);

// Verificar autenticación
function verificarAutenticacion() {
    const usuarioId = localStorage.getItem('usuarioId');

    if (!usuarioId) {
        // Si no hay ID de usuario, redirigir al login
        window.location.href = 'login.html';
        return;
    }

    // Verificar con el servicio si el usuario es válido
    fetch(`${API_URL}/auth/verificar/${usuarioId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Sesión inválida');
            }
            return response.json();
        })
        .then(data => {
            if (!data.success) {
                // Si la verificación falla, limpiar localStorage y redirigir
                localStorage.clear();
                window.location.href = 'login.html';
            }
        })
        .catch(error => {
            console.error('Error al verificar sesión:', error);
            localStorage.clear();
            window.location.href = 'login.html';
        });
}

// Cerrar sesión
function cerrarSesion(e) {
    e.preventDefault();

    // Limpiar datos de autenticación del localStorage
    localStorage.clear();

    // Redirigir al login
    window.location.href = 'login.html';
}

// Funcion para el manejo de productos
async function cargarProductos() {
    try {
        const response = await fetch(`${API_URL}/productos`);
        productos = await response.json();
        await mostrarProductos();
    } catch (error) {
        console.error('Error al cargar productos:', error); 
    }
}

async function mostrarProductos() {
    const contenedor = document.getElementById('contenedorCards');
    contenedor.innerHTML = '';
    const template = document.getElementById('templateCard');

    for (const producto of productos) {
        const clone = template.content.cloneNode(true);

        const card = clone.querySelector('.card-productos');
        const img = clone.querySelector('.imagen-productos');
        const nombre = clone.querySelector('.nombre-productos');
        const descripcion = clone.querySelector('.descripcion-productos');
        const id = clone.querySelector('.id_producto');

        //Imagen
        try {
            const response = await fetch(`${API_URL}/imagenes/obtener/productos/id_producto/${producto.id_productos}`);
            const data = await response.json();
            if (data.imagen) {
                img.src = `data:image/jpeg;base64,${data.imagen}`;
                img.style.display = 'block';
            }
        } catch (error) {
            console.error('Error al cargar la imagen:', error);
        }

        nombre.textContent = `${producto.nombre}`;
        descripcion.textContent = producto.descripcion;
        id.textContent = `ID: ${producto.id_producto}`;

        // Botones
        const btnEditar = clone.querySelector('.btn-editar');
        const btnEliminar = clone.querySelector('.btn-eliminar');
        btnEditar.addEventListener('click', () => editarProducto(producto.id_producto));
        btnEliminar.addEventListener('click', () => eliminarProducto(producto.id_producto));

        contenedor.appendChild(clone);
    }
}


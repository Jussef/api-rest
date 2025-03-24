const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Base de datos temporal
let cursos = [
  {
    id: 1,
    name: "Curso de Python",
    instructor: "Juan Pérez", //
    slug: "curso-python",
    price: 100,
    coupon: "DESCUENTO10",
    description: "Aprende Python desde cero",
    img_path: "https://picsum.photos/id/5/900/400",
    is_generate_certificate: true,
    requirements_certificate: false,
    is_free: false,
    state_id: 1,
    created_by_user_id: 1,
    updated_by_user_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    name: "Curso de JavaScript",
    instructor: "Ana Gómez",
    slug: "curso-javascript",
    price: 120,
    coupon: "DESCUENTO20",
    description: "Domina JavaScript y sus frameworks",
    img_path: "https://picsum.photos/id/10/900/400",
    is_generate_certificate: true,
    requirements_certificate: false,
    is_free: false,
    state_id: 1,
    created_by_user_id: 1,
    updated_by_user_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 3,
    name: "Curso de React",
    instructor: "Luis Martínez",
    slug: "curso-react",
    price: 150,
    coupon: "DESCUENTO30",
    description: "Construye aplicaciones con React",
    img_path: "https://picsum.photos/id/15/900/400",
    is_generate_certificate: true,
    requirements_certificate: false,
    is_free: false,
    state_id: 1,
    created_by_user_id: 1,
    updated_by_user_id: 1,
    created_at: new Date(),
    updated_at: new Date(),
  }
];
let cart = [];

// Rutas
app.get("/", (req, res) => {
  res.send("🎉 API REST en Express funcionando!");
});

// Obtener datos del carrito
app.get("/api/cart", (req, res) => {
  res.json(cart);
});

// Agregar curso al carrito
app.post("/api/cart", (req, res) => {
  const { id } = req.body;
  const curso = cursos.find((c) => c.id == id);
  console.log(curso);
  if (curso) {
    cart.push(curso);
    res.status(201).json(curso);
  } else {
    res.status(404).json({ error: "Curso no encontrado" });
  }
});

// Obtener todos los cursos
app.get("/api/cursos", (req, res) => {
  res.json(cursos);
});

// Obtener curso por ID
app.get("/api/cursos/:id", (req, res) => {
  const curso = cursos.find((c) => c.id == req.params.id);
  curso ? res.json(curso) : res.status(404).json({ error: "Curso no encontrado" });
});

// Agregar nuevo curso
app.post("/api/cursos", (req, res) => {
  const { nombre, instructor, precio } = req.body;
  const nuevoCurso = { id: cursos.length + 1, nombre, instructor, precio };
  cursos.push(nuevoCurso);
  res.status(201).json(nuevoCurso);
});

// Actualizar curso
app.put("/api/cursos/:id", (req, res) => {
  const { nombre, instructor, precio } = req.body;
  const curso = cursos.find((c) => c.id == req.params.id);
  if (curso) {
    curso.nombre = nombre || curso.nombre;
    curso.instructor = instructor || curso.instructor;
    curso.precio = precio || curso.precio;
    res.json(curso);
  } else {
    res.status(404).json({ error: "Curso no encontrado" });
  }
});

// Eliminar curso
app.delete("/api/cursos/:id", (req, res) => {
  cursos = cursos.filter((c) => c.id != req.params.id);
  res.json({ message: "Curso eliminado" });
});

// Iniciar servidor
app.listen(PORT, () => console.log(`✅ API corriendo en http://localhost:${PORT}`));

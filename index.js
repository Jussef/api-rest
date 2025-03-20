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

// Rutas
app.get("/", (req, res) => {
  res.send("🎉 API REST en Express funcionando!");
});

// Obtener todos los cursos
app.get("/cursos", (req, res) => {
  res.json(cursos);
});

// Obtener curso por ID
app.get("/cursos/:id", (req, res) => {
  const curso = cursos.find((c) => c.id == req.params.id);
  curso ? res.json(curso) : res.status(404).json({ error: "Curso no encontrado" });
});

// Agregar nuevo curso
app.post("/cursos", (req, res) => {
  const { nombre, instructor, precio } = req.body;
  const nuevoCurso = { id: cursos.length + 1, nombre, instructor, precio };
  cursos.push(nuevoCurso);
  res.status(201).json(nuevoCurso);
});

// Actualizar curso
app.put("/cursos/:id", (req, res) => {
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
app.delete("/cursos/:id", (req, res) => {
  cursos = cursos.filter((c) => c.id != req.params.id);
  res.json({ message: "Curso eliminado" });
});

// Iniciar servidor
app.listen(PORT, () => console.log(`✅ API corriendo en http://localhost:${PORT}`));

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Conectado a MongoDB"))
.catch(err => console.error("❌ Error al conectar a MongoDB:", err));

// Modelos
const Usuario = mongoose.model("Usuario", new mongoose.Schema({
  name: String,
  email: String,
  cursosComprados: [{ type: mongoose.Schema.Types.ObjectId, ref: "Curso" }]
}));

const Curso = mongoose.model("Curso", new mongoose.Schema({
    id: Number,
    name: String,
    slug: String,
    description: String,
    coupon: String,
    price: Number,
    img_path: String,
    is_generate_certificate: Boolean,
    requirements_certificate: Boolean,
    is_free: Boolean,
    state_id: Number,
    created_by_user_id: Number,
    updated_by_user_id: Number,
    created_at: Date,
    updated_at: Date
}));

// Rutas
app.get("/", (req, res) => res.send("🎉 API REST con MongoDB funcionando!"));

// Obtener todos los cursos
app.get("/cursos", async (req, res) => {
  const cursos = await Curso.find();
  res.json(cursos);
});

// Agregar un nuevo curso
app.post("/cursos", async (req, res) => {
  const curso = new Curso(req.body);
  await curso.save();
  res.status(201).json(curso);
});

// Obtener todos los usuarios y sus cursos comprados
app.get("/usuarios", async (req, res) => {
  const usuarios = await Usuario.find().populate("cursosComprados");
  res.json(usuarios);
});

// Registrar usuario
app.post("/usuarios", async (req, res) => {
  const usuario = new Usuario(req.body);
  await usuario.save();
  res.status(201).json(usuario);
});

// Comprar curso (Agregar curso a usuario)
app.post("/usuarios/:id/comprar", async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);
  if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

  const curso = await Curso.findById(req.body.cursoId);
  if (!curso) return res.status(404).json({ error: "Curso no encontrado" });

  usuario.cursosComprados.push(curso._id);
  await usuario.save();

  res.json({ message: "Curso comprado", usuario });
});

// Iniciar servidor
app.listen(PORT, () => console.log(`✅ API corriendo en http://localhost:${PORT}`));

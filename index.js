const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const stripe = Stripe("sk_test_51R8soY4SIZ8T9SE77BYBUmHvAmlqHMlCekYumY4et5fqkUqvz9FfCuoAQDIyzd9WM9hqB8ZTSEIZiG6VyiHgqO9D00hM7EDZlH"); // Clave secreta

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
// 👇 Middleware global solo para JSON (NO para webhook)
app.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next(); // deja que lo maneje express.raw()
  } else {
    express.json()(req, res, next);
  }
});

// Base de datos temporal
let cursos = [
  {
    id: 1,
    name: "Curso de Python",
    instructor: "Juan Pérez", //
    slug: "curso-python",
    price: 100,
    coupon: "DESCUENTO10",
    description: "Aprende Python desde cero lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
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
    description: "Domina JavaScript y sus frameworks lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
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
    description: "Construye aplicaciones con React lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
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
let coupons = [
  {
    id: 1,
    code: "DESCUENTO10",
    discount: 10,
    is_active: true,
  },
  {
    id: 2,
    code: "DESCUENTO20",
    discount: 20,
    is_active: true,
  },
  {
    id: 3,
    code: "DESCUENTO30",
    discount: 30,
    is_active: true,
  }
];
let compras = [];

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
  const { id, quantity } = req.body;
  const curso = cursos.find((c) => c.id == id);

  if (curso) {
    const existingItem = cart.find((c) => c.id == id);
    if (existingItem) {
      return res.status(400).json({ error: "El curso ya está en el carrito. Usa PATCH para actualizar." });
    }

    const cartItem = {
      id: curso.id,
      quantity: quantity || 1
    };
    cart.push(cartItem);
    res.status(201).json(cartItem);
  } else {
    res.status(404).json({ error: "Curso no encontrado" });
  }
});
// Actualizar curso en el carrito
app.patch("/api/cart/:id", (req, res) => {
  const { quantity } = req.body;
  const cartItem = cart.find((c) => c.id == req.params.id);

  if (cartItem) {
    cartItem.quantity = Number(quantity) || cartItem.quantity;
    res.json(cartItem);
  } else {
    res.status(404).json({ error: "Curso no encontrado en el carrito" });
  }
});
// Eliminar curso del carrito
app.delete("/api/cart/:id", (req, res) => {
  cart = cart.filter((c) => c.id != req.params.id);
  res.json({ message: "Curso eliminado del carrito" });
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

// Obtener todos los coupons
app.get("/api/coupons", (req, res) => {
  res.json(coupons);
});
// Obtener cupón por ID
app.get("/api/coupons/:id", (req, res) => {
  const coupon = coupons.find((c) => c.id == req.params.id);
  coupon ? res.json(coupon) : res.status(404).json({ error: "Cupón no encontrado" });
});

// Crear pago con Stripe
app.post("/api/checkout-session", async (req, res) => {
  const { amount, courseIds, userEmail } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: "Pago por carrito de cursos",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
      metadata: {
        course_ids: courseIds,
        user_email: userEmail,
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error al crear la sesión de pago:", error);
    res.status(500).send("Error al crear la sesión de pago");
  }
});
// Webhook de Stripe
app.post("/webhook", express.raw({ type: "application/json" }), (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, 'whsec_ea5889a3693956fec35d4edf316860d6d25c2aee43746ed88958368e687764ca');
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed.", err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userEmail = session.metadata.user_email;
    const courseIds = session.metadata.course_ids.split(",");
    const amountTotal = session.amount_total / 100;

    const compra = {
      email: userEmail,
      courses: courseIds.map(id => Number(id)),
      stripe_session_id: session.id,
      amount_total: amountTotal,
      paid_at: new Date().toISOString(),
    };

    compras.push(compra);

    console.log("✅ Compra guardada:", compra);
  }

  response.status(200).end();
});
// Obtener compras por email
app.get("/api/compras/:email", (req, res) => {
  const email = req.params.email;
  const comprasUsuario = compras.filter(compra => compra.email === email);

  if (comprasUsuario.length === 0) {
    return res.status(404).json({ message: "No se encontraron compras para este usuario." });
  }

  res.json(comprasUsuario);
});
// Obtener compras por ID
app.get("/api/compras/:id", (req, res) => {
  const compra = compras.find(compra => compra.id == req.params.id);

  if (!compra) {
    return res.status(404).json({ message: "Compra no encontrada." });
  }

  res.json(compra);
});
// Obtener compras
app.get("/api/compras", (req, res) => {
  res.json(compras);
});




// Iniciar servidor
app.listen(PORT, () => console.log(`✅ API corriendo en http://localhost:${PORT}`));

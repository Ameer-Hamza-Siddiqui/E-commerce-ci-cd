import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "./api";

function Navbar({ cartCount, user, setUser }) {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">MERN Shop</Link>
      <div>
        <Link to="/cart">Cart ({cartCount})</Link>
        {user ? (
          <>
            <span className="user">Hi, {user.name}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const { data } = await API.get("/products");
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  const seedProducts = async () => {
    await API.post("/products/seed");
    loadProducts();
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <div className="hero">
        <h1>MERN E-Commerce Website</h1>
        <p>React + Node.js + Express + MongoDB + Docker</p>
        <button onClick={seedProducts}>Add Sample Products</button>
      </div>
      <div className="grid">
        {products.map((product) => (
          <div className="card" key={product._id}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <strong>Rs {product.price}</strong>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cart({ cart, setCart, user }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const removeItem = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const placeOrder = async () => {
    if (!user) return alert("Please login first");
    if (cart.length === 0) return alert("Cart is empty");

    const orderItems = cart.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      product: item._id
    }));

    await API.post("/orders", { orderItems, totalPrice: total });
    setCart([]);
    alert("Order placed successfully");
  };

  return (
    <div className="box">
      <h2>Your Cart</h2>
      {cart.length === 0 && <p>No items in cart</p>}
      {cart.map((item) => (
        <div className="cart-row" key={item._id}>
          <span>{item.name} x {item.quantity}</span>
          <span>Rs {item.price * item.quantity}</span>
          <button onClick={() => removeItem(item._id)}>Remove</button>
        </div>
      ))}
      <h3>Total: Rs {total}</h3>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
}

function Login({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await API.post("/users/login", form);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    navigate("/");
  };

  return <AuthForm title="Login" form={form} setForm={setForm} submit={submit} />;
}

function Register({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await API.post("/users/register", form);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    navigate("/");
  };

  return <AuthForm title="Register" form={form} setForm={setForm} submit={submit} showName />;
}

function AuthForm({ title, form, setForm, submit, showName }) {
  return (
    <form className="box form" onSubmit={submit}>
      <h2>{title}</h2>
      {showName && <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
      <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button type="submit">{title}</button>
    </form>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));

  const addToCart = (product) => {
    const exists = cart.find((item) => item._id === product._id);
    if (exists) {
      setCart(cart.map((item) => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Navbar cartCount={cartCount} user={user} setUser={setUser} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
        </Routes>
      </main>
    </>
  );
}

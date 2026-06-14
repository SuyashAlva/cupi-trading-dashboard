import http from "node:http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { priceEngine, SUPPORTED_SYMBOLS } from "./priceEngine.js";
import { issueToken, isValidEmail, verifyToken } from "./auth.js";
import type {
  ClientToServerEvents,
  Quote,
  ServerToClientEvents,
  SocketData,
} from "./types.js";

const PORT = Number(process.env.PORT ?? 8080);
const ORIGIN = process.env.CLIENT_ORIGIN ?? "*";

const app = express();
app.use(cors({ origin: ORIGIN }));
app.use(express.json());

// ---- REST -------------------------------------------------------------
app.get("/api/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));

app.get("/api/stocks", (_req, res) => {
  res.json({ symbols: SUPPORTED_SYMBOLS, quotes: priceEngine.snapshot() });
});

// "Login" by email. No password by design (assignment scope), but we still
// validate the address and issue a short-lived signed JWT that the Socket.io
// gateway verifies on every handshake.
app.post("/api/auth/login", (req, res) => {
  const email = req.body?.email;
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }
  res.json({ token: issueToken(email), user: { email: email.trim().toLowerCase() } });
});

const server = http.createServer(app);

// ---- Socket.io gateway ------------------------------------------------
// Subscriptions are modelled as rooms: one room per symbol. Subscribing is
// `socket.join(symbol)`, and a tick is delivered with `io.to(symbol).emit(...)`,
// so Socket.io fans each update out only to the sockets that joined that room.
const io = new Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>(
  server,
  { cors: { origin: ORIGIN } },
);

// Authenticate the JWT during the handshake — before any data can flow.
io.use((socket, next) => {
  const token = socket.handshake.auth?.token as string | undefined;
  const user = verifyToken(token);
  if (!user) return next(new Error("Unauthorized"));
  socket.data.email = user.email;
  next();
});

io.on("connection", (socket) => {
  socket.on("subscribe", (symbols) => {
    const valid = (symbols ?? []).filter((s) => SUPPORTED_SYMBOLS.includes(s));
    valid.forEach((s) => socket.join(s));
    socket.emit("subscribed", [...socket.rooms].filter((r) => r !== socket.id));
    // Immediately push current values so the UI is never blank.
    const quotes = valid
      .map((s) => priceEngine.getQuote(s))
      .filter((q): q is Quote => Boolean(q));
    if (quotes.length) socket.emit("snapshot", quotes);
  });

  socket.on("unsubscribe", (symbols) => {
    (symbols ?? []).forEach((s) => socket.leave(s));
    socket.emit("subscribed", [...socket.rooms].filter((r) => r !== socket.id));
  });
});

// Fan out every tick to the room for that symbol — Socket.io handles the
// per-subscriber delivery. This is the core of the "two users, different
// watchlists, independent updates" requirement.
priceEngine.on("tick", (quote: Quote) => {
  io.to(quote.symbol).emit("tick", quote);
});

priceEngine.start(1000);

server.listen(PORT, () => {
  console.log(`Pulse server listening on http://localhost:${PORT}`);
  console.log(`Socket.io gateway ready (rooms = symbols)`);
});

// Isolation test: two users with disjoint watchlists must each receive ONLY
// their own symbols. With Socket.io, each symbol is a room, so this verifies the
// room-based fan-out. Run the server first (npm run dev:server from the repo
// root), then: node server/e2e-test.mjs
import { io } from "socket.io-client";

async function login(email) {
  const r = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return (await r.json()).token;
}

function user(name, token, symbols) {
  return new Promise((resolve) => {
    const socket = io("http://localhost:8080", { auth: { token }, transports: ["websocket"] });
    const got = new Set();
    socket.on("connect", () => socket.emit("subscribe", symbols));
    socket.on("tick", (q) => got.add(q.symbol));
    setTimeout(() => {
      socket.disconnect();
      resolve({ name, subscribed: symbols, received: [...got] });
    }, 3500);
  });
}

const [tA, tB] = await Promise.all([login("alice@demo.com"), login("bob@demo.com")]);
const [a, b] = await Promise.all([
  user("Alice", tA, ["GOOG", "TSLA"]),
  user("Bob", tB, ["NVDA", "META", "AMZN"]),
]);
console.log("Alice subscribed:", a.subscribed, "-> received:", a.received.sort());
console.log("Bob   subscribed:", b.subscribed, "-> received:", b.received.sort());
const aOk = a.received.sort().join() === a.subscribed.sort().join();
const bOk = b.received.sort().join() === b.subscribed.sort().join();
console.log("\nStreams isolated per user:", aOk && bOk ? "PASS ✅" : "FAIL ❌");
process.exit(aOk && bOk ? 0 : 1);

import { env } from "./config/env.ts";
import { server } from "./server.ts";

const PORT = env.PORT;

async function main() {
  const app = server();
  app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
}

main().catch(console.error);

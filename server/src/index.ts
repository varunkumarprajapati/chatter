import { env } from "./config/env.ts";
import { postgresCheckpointer } from "./modules/ai/checkpointer.ts";
import { server } from "./server.ts";

const PORT = env.PORT;

async function main() {
  await postgresCheckpointer.setup();
  const app = server();
  app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
}

main().catch(console.error);

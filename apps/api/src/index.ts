import { createApp } from "./app.js";

const PORT = 4000;

createApp().listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});

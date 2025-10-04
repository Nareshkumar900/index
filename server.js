import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number.parseInt(process.env.PORT || '3000', 10);
const rootDir = __dirname;

app.use(express.static(rootDir, {
  extensions: ['html']
}));

app.get('/', (_req, res) => {
  res.sendFile(path.join(rootDir, 'Untitled-1.html'));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(rootDir, 'Untitled-1.html'));
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

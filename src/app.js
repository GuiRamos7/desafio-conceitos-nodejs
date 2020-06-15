const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const middleVerifyId = (request, response, next) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid id' });
  }
  return next();
};

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, techs, url } = request.body;
  const repository = { title, techs, url, id: uuid(), likes: 0 };
  repositories.push(repository);
  return response.json(repository);
});

app.put('/repositories/:id', middleVerifyId, (request, response) => {
  const { title, techs, url } = request.body;
  const { id } = request.params;
  const indexRepository = repositories.findIndex((repo) => repo.id === id);

  if (indexRepository < 0) {
    return res.status(400).json({ error: 'Product not found' });
  }

  const newRepository = {
    ...repositories[indexRepository],
    title: title ? title : repositories[indexRepository].title,
    techs: techs ? techs : repositories[indexRepository].techs,
    url: url ? url : repositories[indexRepository].url,
  };

  repositories[indexRepository] = newRepository;

  return response.json(newRepository);
});

app.delete('/repositories/:id', middleVerifyId, (request, response) => {
  const { id } = request.params;
  const indexRepository = repositories.findIndex((repo) => repo.id === id);
  if (indexRepository < 0) {
    return response.status(400).json({ error: 'Product not found' });
  }
  repositories.splice(indexRepository, 1);
  return response.status(204).send();
});

app.post('/repositories/:id/like', middleVerifyId, (request, response) => {
  const { id } = request.params;
  const indexRepository = repositories.findIndex((repo) => repo.id === id);

  if (indexRepository < 0) {
    return res.status(400).json({ error: 'Product not found' });
  }

  const newRepository = {
    ...repositories[indexRepository],
    likes: repositories[indexRepository].likes + 1,
  };

  repositories[indexRepository] = newRepository;

  return response.json(newRepository);
});

module.exports = app;

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('.'));

const usersFile = 'users.json';
const progressFile = 'progress.json';

async function readJSONFile(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

async function writeJSONFile(filename, data) {
    await fs.writeFile(filename, JSON.stringify(data, null, 2));
}

app.post('/sign-up', async (req, res) => {
    const { username, password } = req.body;
    const users = await readJSONFile(usersFile);

    if (users[username]) {
        res.json({ success: false, message: 'Username already exists' });
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        users[username] = hashedPassword;
        await writeJSONFile(usersFile, users);
        res.json({ success: true });
    }
});

app.post('/sign-in', async (req, res) => {
    const { username, password } = req.body;
    const users = await readJSONFile(usersFile);

    if (users[username] && await bcrypt.compare(password, users[username])) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.post('/save-progress', async (req, res) => {
    const { username, progress } = req.body;
    const allProgress = await readJSONFile(progressFile);
    allProgress[username] = progress;
    await writeJSONFile(progressFile, allProgress);
    res.json({ success: true });
});

app.get('/load-progress', async (req, res) => {
    const { username } = req.query;
    const allProgress = await readJSONFile(progressFile);
    res.json(allProgress[username] || {});
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
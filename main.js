const {program} = require('commander');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
app.use(express.json());

program
    .requiredOption('-h, --host <host>', 'host')
    .requiredOption('-p, --port <port>', 'port')
    .requiredOption('-c, --cache <cache>', 'cache');

program.parse(process.argv);

const {host, port, cacheDir} = program.opts();

if (!fs.existsSync(cacheDir)) {
    fs.writeFileSync(cacheDir, JSON.stringify({}));
    console.log(`Cache file created at ${cacheDir}`);
} else {
    console.log(`Cache file found at ${cacheDir}`);
}

app.get('notes/:name', (req, res) => {
    const {name} = req.params;
    const cache = JSON.parse(fs.readFileSync(cacheDir));
    if (cache[name]) {
        res.status(200).send(cache[name]);
    } else {
        res.status(404).send('Note not found');
    }
});

app.put('/notes/:name', (req, res) => {
    const {name} = req.params;
    const {content} = req.body;
    const cache = JSON.parse(fs.readFileSync(cacheDir));
    if (!cache[name]) {
        res.status(404).send('Note not found');
        return;
    }
    cache[name] = content;
    fs.writeFileSync(cacheDir, JSON.stringify(cache));
    res.status(200).send('Note saved');
});

app.delete('/notes/:name', (req, res) => {
    const {name} = req.params;
    const cache = JSON.parse(fs.readFileSync(cacheDir));
    if (!cache[name]) {
        res.status(404).send('Note not found');
        return;
    }
    delete cache[name];
    fs.writeFileSync(cacheDir, JSON.stringify(cache));
    res.status(200).send('Note deleted');
});

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
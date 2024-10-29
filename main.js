const {program} = require('commander');
const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

program
    .requiredOption('-h, --host <host>', 'host')
    .requiredOption('-p, --port <port>', 'port')
    .requiredOption('-c, --cache <cache>', 'cache');

program.parse(process.argv);

const {host, port, cacheDir} = program.opts();

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
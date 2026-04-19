'use strict';

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const util = require('util');

const server = express();
const PORT = 80;

const storage = {
    async _handleFile(req, file, cb) {
        const hash = crypto.createHash('sha256');
        const stream = fs.createWriteStream('./uploads/temp');
        let finalPath;

        await new Promise((res, rej) => {
            file.stream
                .on('data', chunk => {
                    hash.update(chunk);
                    stream.write(chunk);
                })
                .on('end', () => {
                    stream.end();
                    const final = hash.digest('hex');
                    finalPath = path.join('uploads', final);
                    if (fs.existsSync(finalPath)) {
                        fs.rmSync('./uploads/temp');
                        res();
                        return;
                    }
                    fs.mkdirSync(finalPath, { recursive: true });
                    fs.renameSync("./uploads/temp", path.join(finalPath, "main"));
                    res();
                });
        });

        cb(null, { path: finalPath, filename: 'main' })
    }
}
const upload = multer({ storage: storage });

server.use(express.static('./static/'));
server.use(express.json());

server.get('/', (req, resp) => {
    fs.readFile('./static/index.html', 'utf-8', (err, data) => {
        if (err) resp.sendStatus(500);
        else resp.send(data);
    });
});

server.post('/upload', upload.single('file'), async (req, resp) => {
    const hash = req.file.path.slice(8);
    let duration = null;
    let parts = null;
    let obj = null;

    await new Promise((resolve, reject) => {
        ffmpeg.ffprobe(path.join(req.file.path, "main"), (err, data) => {
            if (err) reject(err);
            duration = Math.trunc(data.format.duration);
            resolve();
        });
    });

    if (!fs.existsSync(path.join(req.file.path, "parts"))) {
        obj = {
            id: hash,
            duration: duration,
            sections: null
        }
        fs.writeFileSync(path.join(req.file.path, "config.json"), JSON.stringify(obj), 'utf8');
        fs.mkdirSync(path.join(req.file.path, "parts"));
    }
    else {
        parts = JSON.parse(fs.readFileSync(path.join(req.file.path, "config.json"), 'utf8'));
        obj = {
            id: hash,
            duration: duration,
            sections: parts.sections
        };
    }

    resp.json(obj);
    resp.send();
});

server.post('/get-test', async (req, resp) => {
    const data = req.body;
    const cfgpath = path.join("uploads", data.id, "config.json");
    const partspath = path.join("uploads", data.id, "parts");
    const cfg = fs.readFileSync(cfgpath, 'utf8');
    const currData = JSON.parse(cfg);

    let rand = [];

    if (util.isDeepStrictEqual(data, currData)) {
        resp.status(201);
        for (let i = 0; i < currData.sections.length; i++) rand.push([i, data.sections[i][2]]);
        for (let i = currData.sections.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [rand[i], rand[j]] = [rand[j], rand[i]];
        }
        resp.json({
            parts: rand
        });
        resp.send();
        return;
    }

    fs.readdirSync(partspath).forEach(f => fs.rmSync(path.join(partspath, f), { recursive: true, force: true }));

    let count = 0;
    for (const sec of data.sections) {
        const savepath = path.join(partspath, `part${count}.mp3`);
        await new Promise((resolve, reject) => {
            ffmpeg(path.join("uploads", data.id, "main"))
                .on('end', () => resolve())
                .on('error', err => reject(err))
                .seekInput(sec[0])
                .duration(sec[1] - sec[0])
                .save(savepath);
        });
        rand.push([count, sec[2]]);
        count++;
    }

    for (let i = count - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rand[i], rand[j]] = [rand[j], rand[i]];
    }

    fs.writeFileSync(cfgpath, JSON.stringify(data));

    resp.status(201);
    resp.json({
        parts: rand
    });
    resp.send();
});

server.post("/get-part", (req, resp) => {
    const data = req.body;
    resp.sendFile(path.join(__dirname, "uploads", data.id, "parts", `part${data.part}.mp3`), err => {
        if (err) {
            console.log(err);
            resp.sendStatus(500);
        }
    });
});

server.get(/\/[A-Fa-f0-9]{64}$/, (req, resp) => {
    fs.readFile('./static/index.html', 'utf-8', (err, data) => {
        if (err) resp.sendStatus(500);
        else resp.send(data);
    });
});

server.post("/get-sections", (req, resp) => {
    const obj = req.body;

    if (!fs.existsSync(path.join("uploads", obj.hash))) {
        resp.sendStatus(404);
        return;
    }

    const parsed = JSON.parse(fs.readFileSync(path.join("uploads", obj.hash, "config.json"), 'utf8'));

    const body = {
        id: obj.hash,
        duration: parsed.duration,
        parts: parsed.sections
    }
    resp.json(body);
    resp.send();
});

server.listen(PORT, err => {
    if (err) throw err;
    console.log(`Server is running at http://localhost:${PORT}`);
});
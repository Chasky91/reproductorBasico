import express from 'express'
import fs from 'fs'
import path from 'path'
import cors from 'cors'

const app = express()
const  AUDIO_DIR = './assets/music'
const PORT = 5000;

app.use(express.json())
app.use(cors())


app.get('/', (req, res) => {
    res.send('Hola desde el backend')
})

app.get('/api/v1/musicas', (req, res) => {

    try {
        const files = fs.readdirSync(AUDIO_DIR);

        const audioFiles = files
        .filter(file => /\.(mp3|wav|ogg|m4a)$/i.test(file))
        .map((file, index) => ({
            id: index,
            title: path.parse(file).name,
            filename: file,
            url: AUDIO_DIR+encodeURIComponent(file)
        }));
    
        res.json(audioFiles);
    } catch (error) {
        res.status(500).json({ error: 'Error reading audio directory' });
    }
})

app.listen(PORT, () => {
    console.log("operandodesde el servidor")
})
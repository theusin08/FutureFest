const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const app = express();
const port = 3000;
const methodOverride = require('method-override');
const url = "mongodb://localhost:27017/";
const dbName = 'amazonaverde';
const produtosCollection = 'produtos';
const usuariosCollection = 'usuarios';
const session = require('express-session');
const bcrypt = require('bcrypt');

// Middleware
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'segredo-super-seguro',
    resave: false,
    saveUninitialized: true
}))

// Conexão com o banco de dados
async function connectToDB() {
    const client = new MongoClient(url);
    await client.connect();
    return client.db(dbName);
}

// Rota inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para criar produtos
app.post('/produtos', async (req, res) => {
    const produto = req.body;
    const db = await connectToDB();
    const collection = db.collection(produtosCollection);

    try {
        const result = await collection.insertOne(produto);
        res.status(201).json({ _id: result.insertedId, ...produto });
    } catch (err) {
        console.error('Erro ao cadastrar produto:', err);
        res.status(500).send('Erro ao cadastrar produto. Por favor, tente novamente mais tarde.');
    }
});

// Rota para buscar todos os produtos
app.get('/produtos', async (req, res) => {
    const db = await connectToDB();
    const collection = db.collection(produtosCollection);

    try {
        const produtos = await collection.find().toArray();
        res.json(produtos);
    } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        res.status(500).send('Erro ao buscar produtos. Por favor, tente novamente mais tarde.');
    }
});

// Rota para buscar um produto específico pelo ID
app.get('/produtos/:id', async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).send('ID inválido.');
    }

    const db = await connectToDB();
    const collection = db.collection(produtosCollection);

    try {
        const produto = await collection.findOne({ _id: new ObjectId(id) });
        if (!produto) {
            return res.status(404).send('Produto não encontrado.');
        }
        res.json(produto);
    } catch (err) {
        console.error('Erro ao buscar produto:', err);
        res.status(500).send('Erro ao buscar produto. Por favor, tente novamente mais tarde.');
    }
});

// Rota para atualizar produtos
app.post('/atualizar', async (req, res) => {
    const { id, nome, linkImagem, preco, descricao } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).send('ID inválido.');
    }

    const db = await connectToDB();
    const collection = db.collection(produtosCollection);

    try {
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { nome, linkImagem, preco, descricao } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).send('Produto não encontrado.');
        }

        res.status(200).send('Produto atualizado com sucesso!');
    } catch (err) {
        console.error('Erro ao atualizar produto:', err);
        res.status(500).send('Erro ao atualizar produto. Por favor, tente novamente mais tarde.');
    }
});

// Rota para excluir produtos
app.delete('/produtos/:id', async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).send('ID inválido.');
    }

    const db = await connectToDB();
    const collection = db.collection(produtosCollection);

    try {
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 1) {
            res.status(200).send('Produto excluído com sucesso.');
        } else {
            res.status(404).send('Produto não encontrado.');
        }
    } catch (err) {
        console.error('Erro ao excluir produto:', err);
        res.status(500).send('Erro ao excluir produto. Por favor, tente novamente mais tarde.');
    }
});

// Rota para carregar a página de atualização
app.get('/atualizar', (req, res) => {
    res.sendFile(path.join(__dirname, 'atualizar.html'));
});
app.get('/oncaPintada', (req, res) => {
    res.sendFile(path.join(__dirname, 'oncaPintada.html'));
});

app.get('/ararajuba', (req, res) => {
    res.sendFile(path.join(__dirname, 'ararajuba.html'));
});

app.get('/ariranha', (req, res) => {
    res.sendFile(path.join(__dirname, 'ariranha.html'));
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/cadastro.html'));
});

app.get('/bemvindo', protegerRota, (req, res) => {
    console.log('Usuário logado:', req.session.usuario);
    res.sendFile(path.join(__dirname, 'views/welcome.html'));
});


app.get('/botoCorDeRosa', (req, res) => {
    res.sendFile(path.join(__dirname, 'botoCorDeRosa.html'));
});

app.get('/GatoMaracaja', (req, res) => {
    res.sendFile(path.join(__dirname, 'GatoMaracaja.html'));
});

app.get('/gaviaoReal', (req, res) => {
    res.sendFile(path.join(__dirname, 'gaviaoReal.html'));
});

app.get('/macacoAranha', (req, res) => {
    res.sendFile(path.join(__dirname, 'macacoAranha.html'));
});

app.get('/macacoPrego', (req, res) => {
    res.sendFile(path.join(__dirname, 'macacoPrego.html'));
});

app.get('/oncaParda', (req, res) => {
    res.sendFile(path.join(__dirname, 'oncaParda.html'));
});

app.get('/peixeBoi', (req, res) => {
    res.sendFile(path.join(__dirname, 'peixeBoi.html'));
});

app.get('/sauimDeColeira', (req, res) => {
    res.sendFile(path.join(__dirname, 'sauimDeColeira.html'));
});

app.get('/uacari', (req, res) => {
    res.sendFile(path.join(__dirname, 'uacari.html'));
});

app.get('/updateDados', (req, res) => {
    res.sendFile(path.join(__dirname, 'updateDados.html'));
});

app.get('/planos', (req, res) => {
    res.sendFile(path.join(__dirname, 'planos.html'));
});

app.post('/cadastro', async (req, res) => {
    const usuario = req.body;
    const db = await connectToDB();
    const collection = db.collection(usuariosCollection);

    try {
        const usuarioExistente = await collection.findOne({ usuario: usuario.usuario });

        if (usuarioExistente) {
            return res.status(400).send('Usuário já existe! Tente outro nome de usuário.');
        }

        usuario.senha = await bcrypt.hash(usuario.senha, 10);
        await collection.insertOne(usuario);
        
        // Armazena o usuário na sessão
        req.session.usuario = usuario.usuario; // Armazena o nome do usuário na sessão
        return res.redirect('/bemvindo'); 
    } catch (err) {
        console.error('Erro ao registrar usuário:', err);
        return res.status(500).send('Erro ao registrar usuário. Por favor, tente novamente mais tarde.');
    }
});



app.post('/login', async (req, res) => {
    const { usuario, senha } = req.body;
    const db = await connectToDB();
    const collection = db.collection(usuariosCollection);

    try {
        const usuarioEncontrado = await collection.findOne({ usuario });

        if (usuarioEncontrado && await bcrypt.compare(senha, usuarioEncontrado.senha)) {
            req.session.usuario = usuario; // Guarda o nome de usuário na sessão
            res.redirect('/bemvindo'); // Redireciona para a página de boas-vindas
        } else {
            res.redirect('/erro'); // Redireciona para a página de erro
        }
    } catch (err) {
        console.error('Erro ao realizar login:', err);
        res.status(500).send('Erro ao realizar login. Por favor, tente novamente mais tarde.');
    }
});
function protegerRota(req, res, proximo) {
    if (req.session.usuario) {
        proximo();
    } else {
        res.redirect('/bemvindo');
    }
}

// Exemplo de uso em uma rota protegida
app.get('/bemvindo', protegerRota, (req, res) => {
    res.sendFile(path.join(__dirname, 'views/welcome.html'));
});
// Rota para adicionar usuários
app.post('/usuarios', async (req, res) => {
    const usuario = req.body;
    const db = await connectToDB();
    const collection = db.collection(usuariosCollection);

    try {
        const result = await collection.insertOne(usuario);
        const novoUsuario = await collection.findOne({ _id: result.insertedId });
        res.status(201).json(novoUsuario);
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        res.status(500).send('Erro ao cadastrar usuário. Por favor, tente novamente mais tarde.');
    }
});

// Inicializando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);
});




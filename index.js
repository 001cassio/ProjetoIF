const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const moment = require('moment');
const conectaBD = require("./models/banco");

const app = express();

// Middleware para analisar o corpo da requisição
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurando o Handlebars como o motor de templates
app.engine('handlebars', engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {
        formatDate: (date) => moment(date).format('DD/MM/YYYY')
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Servir arquivos estáticos (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));


const router = express.Router();

// Página principal
router.get('/', (req, res) => {
    res.render('index', {
        titulo: 'Home',
        nomeCss: 'css/01Style.css'
    });
});

// Página de listagem de animais
router.get('/animais', async (req, res) => {
    try {
        //aqui envia tambem o nome do veterinario para lista
        const animais = await conectaBD.animaisbd.findAll({
            include: [{
                model: conectaBD.veterinariobd,
                attributes: ['nome']
            }]
        });

        const animaisPlain = animais.map(animal => animal.get({ plain: true }));

        res.render('animais', {
            titulo: 'Lista de Animais',
            nomeCss: 'css/02Style.css',
            animais: animaisPlain
        });
    } catch (error) {
        console.error('Erro ao buscar os animais:', error);
        res.status(500).send('Erro ao buscar os animais');
    }
});

// Lista de veterinários (Rota usada para o modal)

router.get('/lst-veterinarios', async (req, res) => {
    try {
        const veterinarios = await conectaBD.veterinariobd.findAll({
            attributes: ['ID','nome'] // Inclui ID e Nome para ser enviado na hora do update
        });

        console.log('Veterinários retornados:', veterinarios);

        const veterinariosPlain = veterinarios.map(veterinario => veterinario.get({ plain: true }));

        res.json(veterinariosPlain); // Retorna JSON com ID e Nome
    } catch (error) {
        console.error('Erro ao buscar veterinários:', error);
        res.status(500).send('Erro ao buscar veterinários');
    }
});



// Inserir animal
router.post('/insert-animal', async (req, res) => {
    try {
        await conectaBD.animaisbd.create({
            nome: req.body.nome,
            tipo: req.body.tipo,
            raca: req.body.raca,
            cor: req.body.cor,
            nomeDono: req.body.nomeDono,
            FK_Id_Veterinario: req.body.veterinario
        });
        res.redirect('/animais'); // Redireciona para a rota /animais após o cadastro
    } catch (erro) {
        console.error("Erro ao cadastrar o animal:", erro);
        res.status(500).send("Erro: Não foi possível concluir a operação. " + erro.message);
    }
});


// Atualizar animal
router.post('/update-animal/:id', async (req, res) => {
    const animalId = req.params.id; // Obtém o ID do animal a ser atualizado a partir da URL

    try {
        // Atualiza o animal com o ID fornecido
        await conectaBD.animaisbd.update({
            nome: req.body.nome,
            tipo: req.body.tipo,
            raca: req.body.raca,
            cor: req.body.cor,
            nomeDono: req.body.nomeDono,
            FK_Id_Veterinario: req.body.veterinario
        }, {
            where: { id: animalId } // Condição para encontrar o animal pelo ID
        });

        // Redireciona para a rota /animais após a atualização
        res.redirect('/animais');
    } catch (erro) {
        console.error("Erro ao atualizar o animal:", erro);
        res.status(500).send("Erro: Não foi possível concluir a operação. " + erro.message);
    }
});


router.delete('/delete-animals', async (req, res) => {
    const animalIds = req.body.ids; // Recebe uma com IDs para excluir

    try {
        // Remove os animais com os IDs fornecidos
        await conectaBD.animaisbd.destroy({
            where: {
                id: animalIds
            }
        });
        res.status(200).send('Animais excluídos com sucesso.');
    } catch (error) {
        console.error("Erro ao excluir animais:", error);
        res.status(500).send("Erro: Não foi possível concluir a operação. " + error.message);
    }
});


// Rota para listar todos os veterinários
router.get('/veterinario', async (req, res) => {
    try {
        // Busca todos os veterinários no banco de dados
        const veterinarios = await conectaBD.veterinariobd.findAll({});

        // Mapeia os dados dos veterinários e formata a data
        const veterinariosPlain = veterinarios.map(veterinario => {
            const vetData = veterinario.get({ plain: true });
            vetData.dataNascimento = moment(vetData.dataNascimento).format('DD/MM/YYYY'); // Formata a data
            return vetData;
        });

        // Renderiza a página 'veterinario' com os dados dos veterinários
        res.render('veterinario', {
            titulo: 'Lista de Veterinários',
            nomeCss: 'css/03Style.css',
            veterinarios: veterinariosPlain // Corrija o nome para 'veterinarios'
        });
    } catch (error) {
        console.error('Erro ao buscar os veterinários:', error);
        res.status(500).send('Erro ao buscar os veterinários');
    }
});


// Inserir veterinario
router.post('/insert-veterinario', async (req, res) => {
    try {
        await conectaBD.veterinariobd.create({
            nome: req.body.nome,
            dataNascimento: req.body.dataNascimento,
            CFMV: req.body.CFMV
            
        });
        res.redirect('/veterinario'); // Redireciona para a rota /animais após o cadastro
    } catch (erro) {
        console.error("Erro ao cadastrar o animal:", erro);
        res.status(500).send("Erro: Não foi possível concluir a operação. " + erro.message);
    }
});


// Atualizar veterinário
router.post('/update-veterinario/:id', async (req, res) => {
    const veterinarioId = req.params.id; // Obtém o ID do veterinário a ser atualizado a partir da URL
    try {
        // Atualiza o veterinário com o ID fornecido
        await conectaBD.veterinariobd.update({
            nome: req.body.nome,
            dataNascimento: req.body.dataNascimento,
            CFMV: req.body.CFMV
        }, {
            where: { id: veterinarioId } // Condição para encontrar o veterinário pelo ID
        });

        // Redireciona para a rota /veterinario após a atualização
        res.redirect('/veterinario');
    } catch (erro) {
        console.error("Erro ao atualizar o veterinário:", erro);
        res.status(500).send("Erro: Não foi possível concluir a operação. " + erro.message);
    }
});

// Excluir veterinários
router.delete('/delete-veterinarios', async (req, res) => {
    const vetIds = req.body.ids; // Obtém a lista de IDs dos veterinários a serem excluídos

    if (!Array.isArray(vetIds) || vetIds.length === 0) {
        return res.status(400).send("Nenhum ID fornecido para exclusão.");
    }

    try {
        // Exclui os veterinários com os IDs fornecidos
        await conectaBD.veterinariobd.destroy({
            where: {
                id: vetIds
            }
        });

        // Retorna uma resposta bem-sucedida
        res.status(200).send("Veterinários excluídos com sucesso.");
    } catch (erro) {
        console.error("Erro ao excluir veterinários:", erro);
        res.status(500).send("Erro: Não foi possível concluir a operação. " + erro.message);
    }
});

//rota sobre
app.get('/sobre', async(req, res)=>{
    res.render('sobre', {
        titulo: 'Sobre',
        nomeCss: 'css/04Style.css',
    });

}
);

// Usar Rotas
app.use('/', router);

// Iniciar o servidor
app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080");
});

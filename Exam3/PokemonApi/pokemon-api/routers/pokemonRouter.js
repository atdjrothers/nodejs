const { pokemonController } = require('../controllers');

exports.handleRequest = (req, res) => {
    switch (req.method) {
        case 'GET':
            return pokemonController.handleGetRequest(req, res);

        case 'POST':
            return pokemonController.handlePostRequest(req, res);

        case 'DELETE':
            return pokemonController.handleDeleteRequest(req, res);

        case 'PUT':
            return pokemonController.handlePutRequest(req, res);

        default:
            res.writeHead(400).end(
                `Ooops! We do not support method ${req.method} for now....`
            );
    }
};

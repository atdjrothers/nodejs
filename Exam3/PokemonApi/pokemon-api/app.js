process.on('uncaughtException', error => {
	console.log(error.message);
});
  
process.on('unhandledRejection', error => {
	console.error(error.message);
});


const http = require('http');
const { pokemonRouter } = require('./routers');

const server = http.createServer((req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    switch (pathname) {
        case '/pokemons':
            pokemonRouter.handleRequest(req, res);
            break;

        default:
            res.writeHead(400).end(
                `Ooops! We do not support path ${pathname} for now....`
            );
    }
});

const port = process.env.port || 3000;
server.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});

const { pokemonService } = require('../services');
const url = require('url');

exports.handleGetRequest = (req, res) => {
    const queryObject = url.parse(req.url,true).query;
    const name = queryObject['name'];
    let data;
    if (!name) {
        data = pokemonService.get();
    } else {
        data = pokemonService.getByName(name);
    }

    const result = { data };

    res.writeHead(200, {
        'Content-Type': 'application/json',
    });
    res.write(JSON.stringify(result));
    res.end();
};

exports.handlePostRequest = (req, res) => {
    const data = [];

    req.on('data', (chunk) => {
        data.push(chunk);
    });

    req.on('end', () => {
        const parsedData = Buffer.concat(data).toString();
        const dataJson = JSON.parse(parsedData);

        const result = pokemonService.insert(dataJson);

        if (!result.success) {
            res.writeHead(400, {
                'Content-Type': 'application/json',
            });
            res.write(JSON.stringify(result));
            res.end();
        }

        res.writeHead(200, {
            'Content-Type': 'application/json',
        });
        res.write(JSON.stringify(result));
        res.end();
    });
};

exports.handleDeleteRequest = (req, res) => {
    const queryObject = url.parse(req.url,true).query;
    const name = queryObject['name'];
    if (!name) {
        res.writeHead(200, {
            'Content-Type': 'application/json',
        });
        res.write('Name is required.');
        res.end();
    } else {
        const data = pokemonService.deleteByName(name);
        let msg;
        console.log(data);
        if (!data || !data.length) {
            msg = `Unabled to delete record. Pokemon ${name} not found.`;
        } else {
            msg = `Pokemon ${name} deleted successfully.`;
        }

        res.writeHead(200, {
            'Content-Type': 'application/json',
        });
        res.write(msg);
        res.end();
    }    
};


exports.handlePutRequest = (req, res) => {
    const data = [];

    req.on('data', (chunk) => {
        data.push(chunk);
    });

    req.on('end', () => {
        const queryObject = url.parse(req.url,true).query;
        const name = queryObject['name'];
        const parsedData = Buffer.concat(data).toString();
        const dataJson = JSON.parse(parsedData);

        if (!dataJson.type) {
            res.writeHead(400, {
                'Content-Type': 'application/json',
            });
            res.write(`Bad Request. Type is required.`);
            res.end();
        } else {
            dataJson['name'] = name;
            const result = pokemonService.updateByName(dataJson);

            if (!result) {
                res.writeHead(400, {
                    'Content-Type': 'application/json',
                });
                res.write(`Unabled to update record. Pokemon ${name} not found.`);
                res.end();
            }
    
            res.writeHead(200, {
                'Content-Type': 'application/json',
            });
            res.write(`Pokemon ${name} record updated sucessfully.`);
            res.end();
        }
    });
};
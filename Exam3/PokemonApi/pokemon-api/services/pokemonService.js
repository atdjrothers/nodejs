const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('../pokemon.json');
const db = lowdb(adapter);

db.defaults({ pokemons: [] }).write();

exports.get = () => {
    const pokemons = db.get('pokemons').value();
    return pokemons;
};

exports.getByName = (name) => {
    const pokemons = db.get('pokemons').value();
    const pokemon = pokemons.filter((_) => _.name.toLowerCase() === name.toLowerCase());
    return pokemon;
};

exports.insert = (pokemon) => {
    const { name } = pokemon;

    const isPokemonExist =
        db
            .get('pokemons')
            .value()
            .filter((_) => _.name === name).length > 0;

    if (isPokemonExist) {
        return {
            success: false,
            errorMessage: `Pokemon ${name} already exist.`,
        };
    }

    db.get('pokemons').push(pokemon).write();

    return {
        success: true,
    };
};

exports.deleteByName = (name) => {
    const pokemon = db.get('pokemons').value().filter((_) => _.name.toLowerCase() === name.toLowerCase());
    if (pokemon.length > 0) {
        const pokemons = db.get('pokemons').value().filter((_) => _.name.toLowerCase() !== name.toLowerCase());
        db.set('pokemons', pokemons).write();
        
    }
    return pokemon;
};

exports.updateByName = (pokemon) => {
    const pokemons = db.get('pokemons').value();
    let out = null;
    if (pokemons.length > 0) {
        const updatedPokemons = pokemons.map(obj => {
            if (obj.name.toLowerCase() === pokemon.name.toLowerCase()) {
                out = pokemon;
                return pokemon;
            }
            return obj;
        });
        db.set('pokemons', updatedPokemons).write();
    }
    return out;
};
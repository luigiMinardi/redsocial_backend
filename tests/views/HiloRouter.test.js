const app = require('../../server');
const mongoose = require('mongoose');
const request = require('supertest');

const clave = process.env.DB_CLAVE;
const database = process.env.DB_DATABASE_TEST;
const usuario = process.env.DB_USUARIO;
const cluster = process.env.DB_CLUSTER;

const url = `mongodb+srv://${usuario}:${clave}@${cluster}.lfcn0.mongodb.net/${database}?retryWrites=true&w=majority`;

const URLBase = '/hilos';
const URLUsuarios = '/usuarios';

let hiloBase;
let usuarioBase;

let resUsuarioBase;
let resHiloBase;

beforeAll((done) => {
    mongoose.connect(url, {
        useNewUrlPArser: true,
        useUnifiedTopology: true,
    }, async () => {
        usuarioBase = {
            nombre: 'Test Hilo',
            apellidos: 'Testing Hilo',
            edad: '2002-08-17T07:32:37.341Z',
            correo: 'testHilo@mail.com',
            clave: '1234',
        };
        resUsuarioBase = await request(app)
            .post(URLUsuarios)
            .send(usuarioBase);
        hiloBase = {
            titulo: 'Test',
            cuerpo: 'Testing',
            fecha: '2022-03-03T07:32:37.341Z',
            usuarioId: resUsuarioBase.body._id,
            comentarios: [],
            likes: [],
        };
        resHiloBase = await request(app)
            .post(URLBase)
            .send(hiloBase);
        done();
    });
});

afterAll((done) => {
    mongoose.connection.db.dropCollection('hilos', () => {
        mongoose.connection.close(() => done());
    });
});

describe('POST endpoint "/"', () => {
    /*
     * Tenemos 8 campos (contando __v y _id).
        {
            "__v": 0,
            "_id": "62472e90fed8a939f748cc14",
            "comentarios": [],
            "cuerpo": "Testing",
            "fecha": "2022-03-03T07:32:37.341Z",
            "likes": [],
            "titulo": "Test",
            "usuarioId": "62472e90fed8a939f748cc11",
        }
    */
    test("CREA hilo con todos los campos rellenados, chequea si el usuario que ha creado el hilo tiene el hilo en el perfil y retorna 201", async () => {

        expect(resHiloBase.body).toHaveProperty('[]', [{
            "__v": 0,
            "_id": resHiloBase.body[0]._id,
            "comentarios": [],
            "cuerpo": "Testing",
            "fecha": "2022-03-03T07:32:37.341Z",
            "likes": [],
            "titulo": "Test",
            "usuarioId": resUsuarioBase.body._id,
        }])
        expect(resHiloBase.statusCode).toEqual(201);

        const res = await request(app).get(`${URLUsuarios}/${resUsuarioBase.body._id}`);
        expect(res.body).toMatchObject({
            __v: 0,
            _id: resUsuarioBase.body._id,
            nombre: 'Test Hilo',
            apellidos: 'Testing Hilo',
            edad: '2002-08-17T07:32:37.341Z',
            correo: 'testHilo@mail.com',
            esAdministrador: false,
            siguiendo: [],
            seguidores: [],
            publicaciones: [[{
                "__v": 0,
                "_id": resHiloBase.body[0]._id,
                "comentarios": [],
                "cuerpo": "Testing",
                "fecha": "2022-03-03T07:32:37.341Z",
                "likes": [],
                "titulo": "Test",
                "usuarioId": resUsuarioBase.body._id,
            },]],
            likes: []
        });
        expect(res.statusCode).toEqual(200);
        resUsuarioBase = res.body;
    });
});


// describe('POST endpoint "/like"', () => {
// });

// describe('GET endpoint "/"', () => {
// });

// describe('GET endpoint "/:id"', () => {
// });

// describe('PATCH endpoint "/:id"', () => {
// })

// describe('DELETE endpoint "/:id"', () => {
// });
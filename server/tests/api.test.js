const request = require('supertest');
const express = require('express');

// On mocke un peu l'application Express pour le test
const app = express();
app.use(express.json());

// Mock de contrôleur
app.get('/api/test', (req, res) => {
    res.status(200).json({ success: true, message: "API is working" });
});

describe('Tests basiques de l\'API', () => {
    it('devrait retourner un statut 200 sur la route de test', async () => {
        const response = await request(app).get('/api/test');
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });
});

const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = function(req, res, next) {
    let token = req.headers["authorization"];

    // jesli jest token
    if (token) {
        // weryfikacja tokenu pod katem jej waznosci, dalam 7 dni
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                res.json({
                    success: false,
                    message: 'Failed to authenticate token'
                });
            } else {
// to jest odkodowanie z szyforwango zapisu, aby mozna bylo dostac sie do obiektu z danymi
                req.decoded = decoded;
                next();

            }
        });

    } else {
// jesli token nie istnieje
        res.status(403).json({
            success: false,
            message: 'No token provided'
        });

    }
};

// to jest middleware, sprwdzajacy waznosc tokenu i czy uzytownik go ma

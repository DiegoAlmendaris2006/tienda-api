CREATE TABLE IF NOT EXISTS clientes (
    id        SERIAL PRIMARY KEY,
    nombre    VARCHAR(100) NOT NULL,
    email     VARCHAR(120) NOT NULL UNIQUE,
    password  VARCHAR(100) NOT NULL,
    rol       VARCHAR(20)  NOT NULL DEFAULT 'cliente',
    activo    BOOLEAN      NOT NULL DEFAULT true,
    creado_en TIMESTAMP DEFAULT NOW()
);
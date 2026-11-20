-- Cabecera: una fila por compra
CREATE TABLE IF NOT EXISTS pedidos (
    id         SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL REFERENCES clientes(id),
    fecha      TIMESTAMP NOT NULL DEFAULT NOW(),
    estado     VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    total      NUMERIC(10,2) NOT NULL DEFAULT 0
);

-- Detalle: una fila por producto del pedido
CREATE TABLE IF NOT EXISTS detalle_pedido (
    id              SERIAL PRIMARY KEY,
    pedido_id       INT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id     INT NOT NULL REFERENCES productos(id),
    cantidad        INT NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(10,2) NOT NULL,
    subtotal        NUMERIC(10,2) NOT NULL
);
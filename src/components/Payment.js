// src/components/Payment.js
import React, { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import '../Payment.css';

const Payment = () => {
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    initMercadoPago('APP_USR-3869ceb4-fadb-433c-8302-921bb67d0b5f'); // Reemplaza con tu clave pública de Mercado Pago

    // Simula la creación de una preferencia de pago
    fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `APP_USR-1752802381810953-061219-b27af363c14b1e022c4d364c8081a08b-240486779`, // Reemplaza con tu token de acceso de Mercado Pago
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            title: 'Servicio de Internet',
            unit_price: 1000,
            quantity: 1,
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => setPreferenceId(data.id));
  }, []);

  return (
    <div className="payment">
      <h2>Realizar Pago</h2>
      {preferenceId && (
        <Wallet
          initialization={{ preferenceId: preferenceId }}
          customization={{
            texts: {
              action: 'pay',
            },
          }}
        />
      )}
    </div>
  );
};

export default Payment;

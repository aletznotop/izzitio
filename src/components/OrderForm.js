// src/components/OrderForm.js
import React, { useState } from 'react';
import '../OrderForm.css'; // Puedes crear este archivo para estilos específicos
import 'bootstrap/'

function OrderForm() {
  const [order, setOrder] = useState({
    customerName: '',
    serviceType: '',
    serviceSpeed: '',
    orderDate: '',
    additionalNotes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder, 
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes añadir lógica para enviar la orden a un servidor
    console.log('Orden de Compra:', order);
    alert('Orden de Compra Enviada');
  };

  return (
    <div class="mb-3">
      <h2>Orden de Compra</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label class="form-label">Nombre del Cliente:</label>
          <input 
            type="text" 
            name="customerName" 
            value={order.customerName} 
            onChange={handleChange} 
            required 
            class="form-control form-control-sm"
          />
        </div>
        <div>
          <label>Tipo de Servicio:</label>
          <select 
            name="serviceType" 
            value={order.serviceType} 
            onChange={handleChange} 
            required
            class="form-select form-select-sm"
          >
            <option value="">Seleccionar...</option>
            <option value="Fiber Optic">Fibra Óptica</option>
            <option value="ADSL">ADSL</option>
            <option value="Satellite">Satélite</option>
          </select>
        </div>
        <div>
          <label>Velocidad del Servicio (Mbps):</label>
          <input 
            type="number" 
            name="serviceSpeed" 
            value={order.serviceSpeed} 
            onChange={handleChange} 
            required 
            class="form-control form-control-sm"
          />
        </div>
        <div>
          <label>Fecha de la Orden:</label>
          <input 
            type="date" 
            name="orderDate" 
            value={order.orderDate} 
            onChange={handleChange} 
            required 
            class="form-control form-control-sm"
          />
        </div>
        <div>
          <label>Notas Adicionales:</label>
          <textarea 
            name="additionalNotes" 
            value={order.additionalNotes} 
            onChange={handleChange} 
            class="form-control form-control-sm"
          ></textarea>
        </div>
        <button type="submit" class="btn btn-primary dropdown-toggle">Enviar Orden</button>
      </form>
    </div>
  );
}

export default OrderForm;



import type { Customer } from './types';

export const customers: Customer[] = [
  {
    id: 'cust_1',
    userId: 'some-user-id',
    firstName: 'Lionel',
    lastName: 'Messi',
    email: 'lio.messi@example.com',
    address: 'Av. Libertador 1234',
    city: 'Rosario',
    zip: 'S2000',
    phoneNumber: '+54 9 341 123-4567',
    gpsLocation: '-32.9478, -60.6303',
    purchaseHistory: [
      { orderId: 'ord_101', date: '2023-10-15T10:00:00Z', total: 155500.00, items: [], status: 'completado' },
      { orderId: 'ord_102', date: '2024-03-22T14:30:00Z', total: 89999.99, items: [], status: 'completado' },
    ],
  },
  {
    id: 'cust_2',
    userId: 'some-user-id',
    firstName: 'Maria',
    lastName: 'Becerra',
    email: 'maria.becerra@example.com',
    address: 'Calle Falsa 456',
    city: 'Quilmes',
    zip: 'B1878',
    phoneNumber: '+54 9 11 9876-5432',
    purchaseHistory: [
      { orderId: 'ord_103', date: '2024-05-01T18:00:00Z', total: 180000.00, items: [], status: 'pendiente' },
    ],
  },
  {
    id: 'cust_3',
    userId: 'some-user-id',
    firstName: 'Bizarrap',
    lastName: 'González',
    email: 'biza@example.com',
    address: 'Corrientes 789',
    city: 'Ramos Mejía',
    zip: 'B1704',
    purchaseHistory: [
      { orderId: 'ord_104', date: '2024-06-10T11:45:00Z', total: 900000.00, items: [], status: 'completado' },
      { orderId: 'ord_105', date: '2024-07-02T09:00:00Z', total: 65000.00, items: [], status: 'pendiente' },
      { orderId: 'ord_106', date: '2024-07-11T20:15:00Z', total: 125000.00, items: [], status: 'cancelado' },
    ],
  },
];

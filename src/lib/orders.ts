export interface OrderItem {
  bookId: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  orderDate: string;
}

declare global {
  var orders: Order[];
}

if (!global.orders) {
  global.orders = [];
}

export function addOrder(orderData: Omit<Order, 'id'>): Order {
  const newOrder: Order = {
    ...orderData,
    id: Date.now().toString()
  };
  
  global.orders.push(newOrder);
  return newOrder;
}

export function getOrders(userId: string): Order[] {
  return global.orders.filter(order => order.userId === userId);
}

export function getOrder(orderId: string): Order | undefined {
  return global.orders.find(order => order.id === orderId);
}

export function getAllOrders(): Order[] {
  return global.orders;
}

export function updateOrderStatus(orderId: string, status: Order['status']): Order | undefined {
  const order = global.orders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
  }
  return order;
}


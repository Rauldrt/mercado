
"use client";

import { useState, useEffect, useCallback } from "react";
import type { Customer, CartItem } from "@/lib/types";
import { getCustomers } from "@/lib/firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Separator } from "../ui/separator";

// Flattened order type for easier table rendering
type Order = {
    orderId: string;
    date: string;
    total: number;
    items: CartItem[];
    orderComment?: string;
    customerName: string;
    customerId: string;
}

export default function AdminOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailViewOpen, setDetailViewOpen] = useState(false);
  const { toast } = useToast();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const customers = await getCustomers();
      const allOrders: Order[] = [];
      customers.forEach((customer: Customer) => {
        if (customer.purchaseHistory) {
          customer.purchaseHistory.forEach(purchase => {
            allOrders.push({
              ...purchase,
              customerName: `${customer.firstName} ${customer.lastName}`,
              customerId: customer.id,
            });
          });
        }
      });
      // Sort orders by date, newest first
      allOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setOrders(allOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los pedidos." });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailViewOpen(true);
  }

  if (loading) {
    return (
        <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }
  
  if (orders.length === 0) {
    return (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold">No hay pedidos todavía</h3>
            <p className="text-muted-foreground mt-2">Cuando se cree el primer pedido, aparecerá aquí.</p>
        </div>
    )
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden md:table-cell">Fecha</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell className="font-medium">{order.customerName}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(order.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </TableCell>
                <TableCell>${new Intl.NumberFormat("es-AR").format(order.total)}</TableCell>
                <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(order)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalles
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

       {/* Order Detail Dialog */}
      <Dialog open={isDetailViewOpen} onOpenChange={setDetailViewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle del Pedido</DialogTitle>
            <DialogDescription>
                Pedido para <span className="font-semibold">{selectedOrder?.customerName}</span> del {selectedOrder && new Date(selectedOrder.date).toLocaleDateString('es-AR')}.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-3">
                 {selectedOrder.items.map(item => (
                    <div key={item.product.id} className="flex items-start gap-4">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                            <Image 
                                src={item.product.imageUrls[0]}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                            />
                        </div>
                        <div className="flex-grow space-y-1">
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {item.quantity} x ${new Intl.NumberFormat('es-AR').format(item.product.price)}
                            </p>
                        </div>
                        <p className="font-semibold text-sm">${new Intl.NumberFormat('es-AR').format(item.product.price * item.quantity)}</p>
                    </div>
                 ))}
              </div>
              <Separator />
               {selectedOrder.orderComment && (
                <div>
                    <h4 className="font-semibold mb-2">Comentario del Pedido:</h4>
                    <p className="text-sm text-muted-foreground p-3 bg-secondary rounded-md">{selectedOrder.orderComment}</p>
                </div>
               )}
              <div className="flex justify-between font-bold text-lg pt-2">
                <span>Total del Pedido:</span>
                <span>${new Intl.NumberFormat('es-AR').format(selectedOrder.total)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


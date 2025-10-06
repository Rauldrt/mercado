
"use client";

import { useState } from "react";
import type { Order as FullOrderDetails } from "@/app/admin/orders/page";
import type { Order as PurchaseOrder } from "@/lib/types";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Eye, MoreHorizontal, Trash2, Pencil, CheckCircle, XCircle, Clock } from "lucide-react";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

interface AdminOrdersTableProps {
    orders: FullOrderDetails[];
    onOrderUpdate: (customerId: string, orderId: string, updates: Partial<PurchaseOrder>) => void;
    onOrderDelete: (customerId: string, orderId: string) => void;
}

export default function AdminOrdersTable({ orders, onOrderUpdate, onOrderDelete }: AdminOrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<FullOrderDetails | null>(null);
  const [isDetailViewOpen, setDetailViewOpen] = useState(false);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [isEditCommentOpen, setEditCommentOpen] = useState(false);
  const [comment, setComment] = useState("");

  const handleViewDetails = (order: FullOrderDetails) => {
    setSelectedOrder(order);
    setDetailViewOpen(true);
  }

  const handleOpenDeleteAlert = (order: FullOrderDetails) => {
    setSelectedOrder(order);
    setDeleteAlertOpen(true);
  };

  const handleOpenEditComment = (order: FullOrderDetails) => {
    setSelectedOrder(order);
    setComment(order.orderComment || "");
    setEditCommentOpen(true);
  };

  const handleSaveComment = () => {
    if (selectedOrder) {
      onOrderUpdate(selectedOrder.customerId, selectedOrder.orderId, { orderComment: comment });
      setEditCommentOpen(false);
      setSelectedOrder(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedOrder) {
      onOrderDelete(selectedOrder.customerId, selectedOrder.orderId);
      setDeleteAlertOpen(false);
      setSelectedOrder(null);
    }
  };

  const handleStatusChange = (order: FullOrderDetails, status: 'pendiente' | 'completado' | 'cancelado') => {
    onOrderUpdate(order.customerId, order.orderId, { status });
  };
  
  const statusConfig = {
    pendiente: { label: 'Pendiente', color: 'bg-yellow-500', icon: Clock },
    completado: { label: 'Completado', color: 'bg-green-500', icon: CheckCircle },
    cancelado: { label: 'Cancelado', color: 'bg-red-500', icon: XCircle },
  };


  if (orders.length === 0) {
    return (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold">No se encontraron pedidos</h3>
            <p className="text-muted-foreground mt-2">Intenta ajustar tu búsqueda o filtros.</p>
        </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden md:table-cell">Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const currentStatus = order.status || 'pendiente';
              const { label, color } = statusConfig[currentStatus];
              return (
              <TableRow key={order.orderId}>
                <TableCell className="font-medium">{order.customerName}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(order.date).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </TableCell>
                <TableCell>
                  <Badge className={cn("text-white", color)}>
                    {label}
                  </Badge>
                </TableCell>
                <TableCell>${new Intl.NumberFormat("es-AR").format(order.total)}</TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                          <Eye className="mr-2 h-4 w-4" /> Ver Detalles
                        </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => handleOpenEditComment(order)}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar Comentario
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                           <DropdownMenuSubTrigger>
                                Cambiar Estado
                           </DropdownMenuSubTrigger>
                           <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => handleStatusChange(order, 'pendiente')}>
                                    <Clock className="mr-2 h-4 w-4" /> Pendiente
                                </DropdownMenuItem>
                                 <DropdownMenuItem onClick={() => handleStatusChange(order, 'completado')}>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Completado
                                </DropdownMenuItem>
                                 <DropdownMenuItem onClick={() => handleStatusChange(order, 'cancelado')}>
                                    <XCircle className="mr-2 h-4 w-4" /> Cancelado
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                           </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleOpenDeleteAlert(order)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            )})}
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
                 {selectedOrder.items && selectedOrder.items.map(item => (
                    <div key={item.product.id} className="flex items-start gap-4">
                        <div className="relative h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                            <Image 
                                src={item.product.imageUrls[0]}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                            />
                        </div>
                        <div className="flex-grow space-y-1">
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {item.quantity} x ${new Intl.NumberFormat('es-AR').format(item.unitPrice)}
                            </p>
                        </div>
                        <p className="font-semibold text-sm">${new Intl.NumberFormat('es-AR').format(item.unitPrice * item.quantity)}</p>
                    </div>
                 ))}
                 {!selectedOrder.items && (
                    <p className="text-sm text-muted-foreground text-center py-4">No hay detalles de productos para este pedido.</p>
                 )}
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
      
      {/* Delete Confirmation Dialog */}
       <Dialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro que deseas eliminar?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el pedido.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Sí, eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Comment Dialog */}
      <Dialog open={isEditCommentOpen} onOpenChange={setEditCommentOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Editar Comentario del Pedido</DialogTitle>
                <DialogDescription>
                    Modifica el comentario para el pedido de <span className="font-semibold">{selectedOrder?.customerName}</span>.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Añadir un comentario..."
                />
            </div>
            <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                <Button onClick={handleSaveComment}>Guardar Comentario</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

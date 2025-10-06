
'use client'

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Loader2, Search, Calendar as CalendarIcon, Filter, FileDown } from "lucide-react";
import AdminOrdersTable from '@/components/admin/orders-table';
import { getCustomers, updateCustomerOrders } from '@/lib/firebase';
import type { Customer, Order as PurchaseOrder } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Papa from 'papaparse';

export type Order = PurchaseOrder & {
    customerName: string;
    customerId: string;
}

function AdminOrdersPage() {
  const { user, isAuthenticating } = useAuth();
  const router = useRouter();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pendiente' | 'completado' | 'cancelado'>('all');
  const { toast } = useToast();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const customers = await getCustomers();
      const fetchedOrders: Order[] = [];
      customers.forEach((customer: Customer) => {
        if (customer.purchaseHistory) {
          customer.purchaseHistory.forEach(purchase => {
            fetchedOrders.push({
              ...purchase,
              customerName: `${customer.firstName} ${customer.lastName}`,
              customerId: customer.id,
            });
          });
        }
      });
      fetchedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setAllOrders(fetchedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticating && !user) {
      router.push('/login');
    } else if (user) {
      fetchOrders();
    }
  }, [user, isAuthenticating, router, fetchOrders]);

  const handleOrderUpdate = async (customerId: string, orderId: string, updates: Partial<PurchaseOrder>) => {
    try {
        await updateCustomerOrders(customerId, orderId, updates);
        toast({ title: "Pedido Actualizado", description: "El estado del pedido ha sido actualizado." });
        await fetchOrders();
    } catch (error) {
        console.error("Failed to update order:", error);
        toast({ variant: "destructive", title: "Error", description: "No se pudo actualizar el pedido." });
    }
  };

  const handleOrderDelete = async (customerId: string, orderId: string) => {
     try {
        await updateCustomerOrders(customerId, orderId, null); // Sending null indicates deletion
        toast({ title: "Pedido Eliminado", description: "El pedido ha sido eliminado permanentemente." });
        await fetchOrders();
    } catch (error) {
        console.error("Failed to delete order:", error);
        toast({ variant: "destructive", title: "Error", description: "No se pudo eliminar el pedido." });
    }
  }

  const handleExportToCsv = () => {
    if (filteredOrders.length === 0) {
      toast({
        title: "No hay pedidos para exportar",
        description: "La lista de pedidos filtrados está vacía.",
      });
      return;
    }

    const dataForCsv = filteredOrders.flatMap(order => 
        order.items.map(item => ({
            'ID Pedido': order.orderId,
            'Fecha': new Date(order.date).toLocaleString('es-AR'),
            'Estado': order.status || 'pendiente',
            'Cliente': order.customerName,
            'ID Cliente': order.customerId,
            'Comentario Pedido': order.orderComment || '',
            'ID Producto': item.product.id,
            'Producto': item.product.name,
            'Cantidad': item.quantity,
            'Presentación': item.presentation === 'bulk' ? 'Bulto' : 'Unidad',
            'Precio Unitario (ARS)': item.unitPrice,
            'Total Artículo (ARS)': item.unitPrice * item.quantity,
            'Total Pedido (ARS)': order.total,
        }))
    );
    
    const csv = Papa.unparse(dataForCsv);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'pedidos.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const filteredOrders = useMemo(() => {
    let orders = allOrders;

    if (statusFilter !== 'all') {
        orders = orders.filter(order => (order.status || 'pendiente') === statusFilter);
    }

    if (dateRange?.from) {
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        orders = orders.filter(order => new Date(order.date) >= fromDate);
    }
    if (dateRange?.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        orders = orders.filter(order => new Date(order.date) <= toDate);
    }

    if (searchQuery) {
        const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.trim() !== '');
        if (searchTerms.length > 0) {
            orders = orders.filter(order => {
                const productText = order.items.map(item => `${item.product.name.toLowerCase()} ${item.product.id.toLowerCase()}`).join(' ');
                const orderText = `
                    ${order.orderId.toLowerCase()}
                    ${order.customerName.toLowerCase()}
                    ${order.customerId.toLowerCase()}
                    ${productText}
                `;
                return searchTerms.every(term => orderText.includes(term));
            });
        }
    }
    return orders;
  }, [allOrders, searchQuery, dateRange, statusFilter]);

  if (isAuthenticating || !user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Historial de Pedidos</h1>
            <p className="text-muted-foreground">Visualiza, busca y filtra todos los pedidos realizados.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Buscar por cliente, ID de pedido, producto..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-4">
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className="w-full md:w-auto justify-start text-left font-normal"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                        dateRange.to ? (
                            <>
                            {format(dateRange.from, "LLL dd, y", { locale: es })} -{" "}
                            {format(dateRange.to, "LLL dd, y", { locale: es })}
                            </>
                        ) : (
                            format(dateRange.from, "LLL dd, y", { locale: es })
                        )
                        ) : (
                        <span>Filtrar por fecha</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        locale={es}
                    />
                    </PopoverContent>
                </Popover>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="completado">Completado</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                </Select>
                 <Button variant="outline" onClick={handleExportToCsv}>
                    <FileDown className="mr-2 h-4 w-4" />
                    Exportar a CSV
                </Button>
            </div>
        </div>

        {loading ? (
             <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
             <AdminOrdersTable
                orders={filteredOrders}
                onOrderUpdate={handleOrderUpdate}
                onOrderDelete={handleOrderDelete}
             />
        )}
      </div>
  )
}

export default AdminOrdersPage;

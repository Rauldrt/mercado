
"use client";

import { useState } from "react";
import { customers as initialCustomers } from "@/lib/customers";
import type { Customer } from "@/lib/types";
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
import { MoreHorizontal, Pencil, Trash2, PlusCircle } from "lucide-react";
import CustomerForm from "./customer-form";
import { useToast } from "@/hooks/use-toast";

export default function AdminCustomersTable() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenForm = (customer: Customer | null) => {
    setSelectedCustomer(customer);
    setFormOpen(true);
  };

  const handleOpenDeleteAlert = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteAlertOpen(true);
  };

  const handleCustomerSave = (customerData: Customer) => {
    if (selectedCustomer) {
      // Edit
      setCustomers(prev =>
        prev.map(c => (c.id === customerData.id ? customerData : c))
      );
      toast({ title: "Cliente Actualizado", description: `Los datos de "${customerData.firstName} ${customerData.lastName}" se han actualizado.` });
    } else {
      // Add
      setCustomers(prev => [...prev, customerData]);
      toast({ title: "Cliente Creado", description: `"${customerData.firstName} ${customerData.lastName}" se ha añadido a tu lista de clientes.` });
    }
    setFormOpen(false);
    setSelectedCustomer(null);
  };

  const handleDeleteCustomer = () => {
    if (selectedCustomer) {
      setCustomers(prev => prev.filter(c => c.id !== selectedCustomer.id));
      toast({ title: "Cliente Eliminado", description: `"${selectedCustomer.firstName} ${selectedCustomer.lastName}" se ha eliminado.` });
    }
    setDeleteAlertOpen(false);
    setSelectedCustomer(null);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => handleOpenForm(null)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Cliente
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre Completo</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Teléfono</TableHead>
              <TableHead className="hidden md:table-cell">Compras</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{`${customer.firstName} ${customer.lastName}`}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell className="hidden md:table-cell">{customer.phoneNumber || 'N/A'}</TableCell>
                <TableCell className="hidden md:table-cell">{customer.purchaseHistory.length}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleOpenForm(customer)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                       <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => handleOpenDeleteAlert(customer)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

       {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCustomer ? 'Editar Cliente' : 'Añadir Nuevo Cliente'}</DialogTitle>
            <DialogDescription>
              {selectedCustomer ? 'Modifica los detalles del cliente.' : 'Completa el formulario para añadir un nuevo cliente.'}
            </DialogDescription>
          </DialogHeader>
            <CustomerForm
                customer={selectedCustomer}
                onSave={handleCustomerSave}
                onCancel={() => setFormOpen(false)}
            />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
       <Dialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro que deseas eliminar?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente al cliente
              <span className="font-bold"> {selectedCustomer?.firstName} {selectedCustomer?.lastName}</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteCustomer}>
              Sí, eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

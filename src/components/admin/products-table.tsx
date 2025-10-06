
"use client";

import { useState, useEffect, useCallback } from "react";
import type { Product } from "@/lib/types";
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
import { MoreHorizontal, Pencil, Trash2, Copy } from "lucide-react";
import Image from "next/image";
import ProductForm from "./product-form";
import { useToast } from "@/hooks/use-toast";
import { addProduct, updateProduct, deleteProduct } from "@/lib/firebase";

interface AdminProductsTableProps {
    products: Product[];
    onProductUpdate: () => void;
}

export default function AdminProductsTable({ products, onProductUpdate }: AdminProductsTableProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenForm = (product: Product | null) => {
    setSelectedProduct(product);
    setFormOpen(true);
  };

  const handleOpenDeleteAlert = (product: Product) => {
    setSelectedProduct(product);
    setDeleteAlertOpen(true);
  };

  const handleProductSave = async (productData: Omit<Product, 'id'> & { id?: string }) => {
    try {
      // Add vendor info if a user is "logged in" (even if simulated)
      const finalProductData = {
          ...productData,
          vendor: 'Tienda Principal',
          vendorId: 'admin'
      }

      if (finalProductData.id) {
        // Edit
        const { id, ...dataToUpdate } = finalProductData;
        await updateProduct(id, dataToUpdate);
        toast({ title: "Producto Actualizado", description: `"${dataToUpdate.name}" se ha actualizado correctamente.` });
      } else {
        // Add
        const { id, ...dataToAdd } = finalProductData; // Destructure to remove id
        await addProduct(dataToAdd);
        toast({ title: "Producto Creado", description: `"${finalProductData.name}" se ha añadido a tu tienda.` });
      }
      onProductUpdate();
    } catch (error) {
       toast({ variant: "destructive", title: "Error", description: "No se pudo guardar el producto." });
       console.error("Failed to save product:", error);
    } finally {
        setFormOpen(false);
        setSelectedProduct(null);
    }
  };

  const handleDeleteProduct = async () => {
    if (selectedProduct) {
       try {
            await deleteProduct(selectedProduct.id);
            toast({ title: "Producto Eliminado", description: `"${selectedProduct.name}" se ha eliminado.` });
            onProductUpdate(); // Refresh list
       } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "No se pudo eliminar el producto." });
            console.error("Failed to delete product:", error);
       } finally {
            setDeleteAlertOpen(false);
            setSelectedProduct(null);
       }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "ID del producto copiado al portapapeles.",
    });
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        {/* The 'Añadir Producto' button is now outside, but we can keep this structure for future actions */}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                Imagen
              </TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="hidden md:table-cell">ID de Producto</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
                products.map((product) => (
                <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                    <Image
                        alt={product.name}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={product.imageUrls[0]}
                        width="64"
                        data-ai-hint="product thumbnail"
                    />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">{product.id}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(product.id)}>
                        <Copy className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                    </TableCell>
                    <TableCell>
                    ${new Intl.NumberFormat("es-AR").format(product.price)}
                    </TableCell>
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
                        <DropdownMenuItem onClick={() => handleOpenForm(product)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleOpenDeleteAlert(product)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        No se encontraron productos.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

       {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProduct ? 'Editar Producto' : 'Añadir Nuevo Producto'}</DialogTitle>
            <DialogDescription>
              {selectedProduct ? 'Modifica los detalles de tu producto.' : 'Completa el formulario para añadir un producto a tu tienda.'}
            </DialogDescription>
          </DialogHeader>
            <ProductForm
                product={selectedProduct}
                onSave={handleProductSave}
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
              Esta acción no se puede deshacer. Esto eliminará permanentemente el producto
              <span className="font-bold"> "{selectedProduct?.name}"</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Sí, eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

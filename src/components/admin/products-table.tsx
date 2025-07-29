
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import type { Product } from "@/lib/types";
// import { useAuth } from "@/contexts/auth-context"; // Auth removed
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
import { MoreHorizontal, Pencil, Trash2, PlusCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import ProductForm from "./product-form";
import { useToast } from "@/hooks/use-toast";
import { addProduct, updateProduct, deleteProduct, getProducts } from "@/lib/firebase";

const MOCK_ADMIN_USER_ID = "admin_user_id";

export default function AdminProductsTable() {
  // const { user } = useAuth(); // Auth removed
  const [vendorProducts, setVendorProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const { toast } = useToast();

  const fetchVendorProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all products since there's no logged-in user
      const products = await getProducts();
      setVendorProducts(products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los productos." });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchVendorProducts();
  }, [fetchVendorProducts]);

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
      if (productData.id) {
        // Edit
        const { id, ...dataToUpdate } = productData;
        await updateProduct(id, dataToUpdate);
        toast({ title: "Producto Actualizado", description: `"${dataToUpdate.name}" se ha actualizado correctamente.` });
      } else {
        // Add
        await addProduct(productData as Omit<Product, 'id'>);
        toast({ title: "Producto Creado", description: `"${productData.name}" se ha añadido a tu tienda.` });
      }
      await fetchVendorProducts(); // Refresh list
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
            await fetchVendorProducts(); // Refresh list
       } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "No se pudo eliminar el producto." });
            console.error("Failed to delete product:", error);
       } finally {
            setDeleteAlertOpen(false);
            setSelectedProduct(null);
       }
    }
  };
  
  if (loading) {
    return (
        <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => handleOpenForm(null)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Producto
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                Imagen
              </TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="hidden md:table-cell">Stock</TableHead>
              <TableHead className="hidden md:table-cell">Precio</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendorProducts.map((product) => (
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
                <TableCell>{product.category}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {product.stock}
                </TableCell>
                <TableCell className="hidden md:table-cell">
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
            ))}
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


"use client";

import { useState } from "react";
import { promotions as initialPromotions } from "@/lib/promotions";
import type { Promotion } from "@/lib/types";
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
import Image from "next/image";
import PromotionForm from "./promotion-form";
import { useToast } from "@/hooks/use-toast";

export default function AdminPromotionsTable() {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenForm = (promotion: Promotion | null) => {
    setSelectedPromotion(promotion);
    setFormOpen(true);
  };

  const handleOpenDeleteAlert = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setDeleteAlertOpen(true);
  };

  const handlePromotionSave = (promotionData: Promotion) => {
    if (selectedPromotion) {
      // Edit
      setPromotions(prev =>
        prev.map(p => (p.id === promotionData.id ? promotionData : p))
      );
       toast({ title: "Promoción Actualizada", description: `La promoción "${promotionData.title}" se ha actualizado.` });
    } else {
      // Add
      setPromotions(prev => [...prev, promotionData]);
       toast({ title: "Promoción Creada", description: `La promoción "${promotionData.title}" se ha añadido.` });
    }
    setFormOpen(false);
    setSelectedPromotion(null);
  };

  const handleDeletePromotion = () => {
    if (selectedPromotion) {
      setPromotions(prev => prev.filter(p => p.id !== selectedPromotion.id));
      toast({ title: "Promoción Eliminada", description: `La promoción "${selectedPromotion.title}" se ha eliminado.` });
    }
    setDeleteAlertOpen(false);
    setSelectedPromotion(null);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => handleOpenForm(null)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Promoción
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                Imagen
              </TableHead>
              <TableHead>Título</TableHead>
              <TableHead className="hidden md:table-cell">Descripción</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.map((promo) => (
              <TableRow key={promo.id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt={promo.title}
                    className="aspect-video rounded-md object-cover"
                    height="64"
                    src={promo.imageUrl}
                    width="128"
                    data-ai-hint="promotion thumbnail"
                  />
                </TableCell>
                <TableCell className="font-medium">{promo.title}</TableCell>
                <TableCell className="hidden md:table-cell max-w-sm truncate">{promo.description}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleOpenForm(promo)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                       <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => handleOpenDeleteAlert(promo)}>
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
            <DialogTitle>{selectedPromotion ? 'Editar Promoción' : 'Añadir Nueva Promoción'}</DialogTitle>
            <DialogDescription>
              {selectedPromotion ? 'Modifica los detalles de la promoción.' : 'Completa el formulario para añadir una nueva promoción.'}
            </DialogDescription>
          </DialogHeader>
            <PromotionForm
                promotion={selectedPromotion}
                onSave={handlePromotionSave}
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
              Esta acción no se puede deshacer. Esto eliminará permanentemente la promoción
              <span className="font-bold"> "{selectedPromotion?.title}"</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeletePromotion}>
              Sí, eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

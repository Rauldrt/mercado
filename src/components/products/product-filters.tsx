import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: number[];
  onPriceChange: (range: number[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  searchQuery,
  onSearchChange,
}: ProductFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-base font-semibold">Mostrar/Ocultar Filtros</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Zapatillas, mate..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select value={selectedCategory} onValueChange={onCategoryChange}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Rango de Precios</Label>
                <div className="text-lg font-semibold text-center py-2">
                  ${new Intl.NumberFormat('es-AR').format(priceRange[0])} - ${new Intl.NumberFormat('es-AR').format(priceRange[1])}
                </div>
                <Slider
                  min={0}
                  max={1000000}
                  step={1000}
                  value={priceRange}
                  onValueChange={onPriceChange}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
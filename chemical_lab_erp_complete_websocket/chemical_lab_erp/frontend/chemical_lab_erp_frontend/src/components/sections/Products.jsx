import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  Beaker, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  AlertTriangle,
  Eye,
  Download
} from 'lucide-react'
import { productsAPI, suppliersAPI, demoAPI } from '../../lib/api'

export default function Products({ user, demoMode }) {
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({
    name: '',
    reference: '',
    chemical_formula: '',
    cas_number: '',
    molecular_weight: '',
    classification: '',
    danger_level: 'Low',
    hazard_statements: '',
    precautionary_statements: '',
    epi_required: '',
    storage_conditions: '',
    unit: 'L',
    default_supplier_id: '',
    unit_price: '',
    category: '',
    subcategory: ''
  })

  useEffect(() => {
    loadData()
  }, [demoMode])

  const loadData = async () => {
    try {
      setLoading(true)
      
      if (demoMode) {
        const [productsData, suppliersData] = await Promise.all([
          demoAPI.getProducts(),
          demoAPI.getSuppliers()
        ])
        setProducts(productsData.products)
        setSuppliers(suppliersData.suppliers)
      } else {
        try {
          const [productsData, suppliersData] = await Promise.all([
            productsAPI.getAll(),
            suppliersAPI.getAll()
          ])
          setProducts(productsData.products || [])
          setSuppliers(suppliersData.suppliers || [])
        } catch (error) {
          console.warn('Erreur API, basculement en mode démo')
          const [productsData, suppliersData] = await Promise.all([
            demoAPI.getProducts(),
            demoAPI.getSuppliers()
          ])
          setProducts(productsData.products)
          setSuppliers(suppliersData.suppliers)
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = async () => {
    try {
      if (demoMode) {
        // Simulation de création en mode démo
        const newId = Math.max(...products.map(p => p.id)) + 1
        const createdProduct = {
          ...newProduct,
          id: newId,
          supplier: suppliers.find(s => s.id === parseInt(newProduct.default_supplier_id))
        }
        setProducts([...products, createdProduct])
      } else {
        const result = await productsAPI.create(newProduct)
        setProducts([...products, result.product])
      }
      
      setShowCreateDialog(false)
      setNewProduct({
        name: '',
        reference: '',
        chemical_formula: '',
        cas_number: '',
        molecular_weight: '',
        classification: '',
        danger_level: 'Low',
        hazard_statements: '',
        precautionary_statements: '',
        epi_required: '',
        storage_conditions: '',
        unit: 'L',
        default_supplier_id: '',
        unit_price: '',
        category: '',
        subcategory: ''
      })
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error)
      alert('Erreur lors de la création du produit: ' + error.message)
    }
  }

  const getDangerBadgeColor = (level) => {
    switch (level) {
      case 'Critical': return 'destructive'
      case 'High': return 'destructive'
      case 'Medium': return 'default'
      case 'Low': return 'secondary'
      default: return 'secondary'
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.cas_number && product.cas_number.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Beaker className="w-8 h-8 mr-2" />
            Gestion des Produits
          </h1>
          <p className="text-gray-600">Gérez votre inventaire de produits chimiques</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Produit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un Nouveau Produit</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau produit chimique à votre inventaire
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit *</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="Ex: Acide Sulfurique"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reference">Référence *</Label>
                <Input
                  id="reference"
                  value={newProduct.reference}
                  onChange={(e) => setNewProduct({...newProduct, reference: e.target.value})}
                  placeholder="Ex: H2SO4-95"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="chemical_formula">Formule chimique</Label>
                <Input
                  id="chemical_formula"
                  value={newProduct.chemical_formula}
                  onChange={(e) => setNewProduct({...newProduct, chemical_formula: e.target.value})}
                  placeholder="Ex: H2SO4"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cas_number">Numéro CAS</Label>
                <Input
                  id="cas_number"
                  value={newProduct.cas_number}
                  onChange={(e) => setNewProduct({...newProduct, cas_number: e.target.value})}
                  placeholder="Ex: 7664-93-9"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="molecular_weight">Masse molaire (g/mol)</Label>
                <Input
                  id="molecular_weight"
                  type="number"
                  step="0.01"
                  value={newProduct.molecular_weight}
                  onChange={(e) => setNewProduct({...newProduct, molecular_weight: e.target.value})}
                  placeholder="Ex: 98.08"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="danger_level">Niveau de danger</Label>
                <Select value={newProduct.danger_level} onValueChange={(value) => setNewProduct({...newProduct, danger_level: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Faible</SelectItem>
                    <SelectItem value="Medium">Moyen</SelectItem>
                    <SelectItem value="High">Élevé</SelectItem>
                    <SelectItem value="Critical">Critique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unité *</Label>
                <Select value={newProduct.unit} onValueChange={(value) => setNewProduct({...newProduct, unit: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Litre (L)</SelectItem>
                    <SelectItem value="mL">Millilitre (mL)</SelectItem>
                    <SelectItem value="kg">Kilogramme (kg)</SelectItem>
                    <SelectItem value="g">Gramme (g)</SelectItem>
                    <SelectItem value="mg">Milligramme (mg)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit_price">Prix unitaire (€)</Label>
                <Input
                  id="unit_price"
                  type="number"
                  step="0.01"
                  value={newProduct.unit_price}
                  onChange={(e) => setNewProduct({...newProduct, unit_price: e.target.value})}
                  placeholder="Ex: 25.50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  id="category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  placeholder="Ex: Acides"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subcategory">Sous-catégorie</Label>
                <Input
                  id="subcategory"
                  value={newProduct.subcategory}
                  onChange={(e) => setNewProduct({...newProduct, subcategory: e.target.value})}
                  placeholder="Ex: Acides minéraux"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supplier">Fournisseur par défaut</Label>
                <Select value={newProduct.default_supplier_id} onValueChange={(value) => setNewProduct({...newProduct, default_supplier_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un fournisseur" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map(supplier => (
                      <SelectItem key={supplier.id} value={supplier.id.toString()}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2 space-y-2">
                <Label htmlFor="hazard_statements">Mentions de danger</Label>
                <Textarea
                  id="hazard_statements"
                  value={newProduct.hazard_statements}
                  onChange={(e) => setNewProduct({...newProduct, hazard_statements: e.target.value})}
                  placeholder="Ex: H314: Provoque des brûlures de la peau..."
                />
              </div>
              
              <div className="col-span-2 space-y-2">
                <Label htmlFor="precautionary_statements">Conseils de prudence</Label>
                <Textarea
                  id="precautionary_statements"
                  value={newProduct.precautionary_statements}
                  onChange={(e) => setNewProduct({...newProduct, precautionary_statements: e.target.value})}
                  placeholder="Ex: P280: Porter des gants de protection..."
                />
              </div>
              
              <div className="col-span-2 space-y-2">
                <Label htmlFor="epi_required">EPI requis</Label>
                <Input
                  id="epi_required"
                  value={newProduct.epi_required}
                  onChange={(e) => setNewProduct({...newProduct, epi_required: e.target.value})}
                  placeholder="Ex: Gants nitrile, lunettes de sécurité, blouse"
                />
              </div>
              
              <div className="col-span-2 space-y-2">
                <Label htmlFor="storage_conditions">Conditions de stockage</Label>
                <Textarea
                  id="storage_conditions"
                  value={newProduct.storage_conditions}
                  onChange={(e) => setNewProduct({...newProduct, storage_conditions: e.target.value})}
                  placeholder="Ex: Endroit sec, ventilé, température ambiante"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateProduct}>
                Créer le Produit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par nom, référence ou numéro CAS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les catégories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Produits ({filteredProducts.length})</CardTitle>
          <CardDescription>
            Liste de tous les produits chimiques de votre inventaire
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Référence</TableHead>
                <TableHead>Formule</TableHead>
                <TableHead>CAS</TableHead>
                <TableHead>Danger</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Fournisseur</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.reference}</TableCell>
                  <TableCell>{product.chemical_formula || '-'}</TableCell>
                  <TableCell>{product.cas_number || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={getDangerBadgeColor(product.danger_level)}>
                      {product.danger_level}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.category || '-'}</TableCell>
                  <TableCell>
                    {product.unit_price ? `${product.unit_price}€/${product.unit}` : '-'}
                  </TableCell>
                  <TableCell>{product.supplier?.name || '-'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <Beaker className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun produit trouvé</p>
              <p className="text-sm text-gray-400">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


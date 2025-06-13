import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Truck, Plus, Phone, Mail, Globe, Star } from 'lucide-react'
import { suppliersAPI, demoAPI } from '../../lib/api'

export default function Suppliers({ user, demoMode }) {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSuppliers()
  }, [demoMode])

  const loadSuppliers = async () => {
    try {
      setLoading(true)
      if (demoMode) {
        const data = await demoAPI.getSuppliers()
        setSuppliers(data.suppliers)
      } else {
        try {
          const data = await suppliersAPI.getAll()
          setSuppliers(data.suppliers || [])
        } catch (error) {
          const data = await demoAPI.getSuppliers()
          setSuppliers(data.suppliers)
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des fournisseurs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Truck className="w-8 h-8 mr-2" />
            Gestion des Fournisseurs
          </h1>
          <p className="text-gray-600">Gérez vos partenaires et fournisseurs</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Fournisseur
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{supplier.name}</CardTitle>
                  <CardDescription>{supplier.code}</CardDescription>
                </div>
                <Badge variant="secondary">
                  {supplier.supplier_type || 'Standard'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {supplier.contact_person && (
                  <div className="flex items-center text-sm">
                    <span className="font-medium w-20">Contact:</span>
                    <span>{supplier.contact_person}</span>
                  </div>
                )}
                
                {supplier.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{supplier.phone}</span>
                  </div>
                )}
                
                {supplier.email && (
                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{supplier.email}</span>
                  </div>
                )}
                
                {supplier.website && (
                  <div className="flex items-center text-sm">
                    <Globe className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-blue-600">{supplier.website}</span>
                  </div>
                )}
                
                {supplier.reliability_score && (
                  <div className="flex items-center text-sm">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    <span>{supplier.reliability_score}/5</span>
                  </div>
                )}
                
                {supplier.specialties && (
                  <div className="text-sm">
                    <span className="font-medium">Spécialités:</span>
                    <p className="text-gray-600 mt-1">{supplier.specialties}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


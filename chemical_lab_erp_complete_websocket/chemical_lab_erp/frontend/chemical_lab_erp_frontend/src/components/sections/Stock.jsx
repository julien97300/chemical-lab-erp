import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Package, TrendingDown, AlertTriangle, BarChart3 } from 'lucide-react'

export default function Stock({ user, demoMode }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Package className="w-8 h-8 mr-2" />
          Gestion des Stocks
        </h1>
        <p className="text-gray-600">Suivi des stocks et mouvements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-600" />
              Stock Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,247</div>
            <p className="text-sm text-gray-600">Unités en stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingDown className="w-5 h-5 mr-2 text-orange-600" />
              Stock Faible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">8</div>
            <p className="text-sm text-gray-600">Produits à réapprovisionner</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
              Péremption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">3</div>
            <p className="text-sm text-gray-600">Produits expirant bientôt</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mouvements de Stock Récents</CardTitle>
          <CardDescription>Dernières entrées et sorties de stock</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: 'Entrée', product: 'Acide Sulfurique', quantity: '+5L', date: 'Aujourd\'hui 14:30' },
              { type: 'Sortie', product: 'Éthanol Absolu', quantity: '-2L', date: 'Aujourd\'hui 11:15' },
              { type: 'Entrée', product: 'Hydroxyde de Sodium', quantity: '+10kg', date: 'Hier 16:45' }
            ].map((movement, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium">{movement.product}</p>
                  <p className="text-sm text-gray-600">{movement.type}</p>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${movement.type === 'Entrée' ? 'text-green-600' : 'text-red-600'}`}>
                    {movement.quantity}
                  </p>
                  <p className="text-xs text-gray-500">{movement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


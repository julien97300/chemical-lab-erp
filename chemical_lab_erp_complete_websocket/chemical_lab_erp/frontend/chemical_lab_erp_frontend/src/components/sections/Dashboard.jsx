import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  Users, 
  ShoppingCart,
  Activity,
  DollarSign,
  Calendar
} from 'lucide-react'
import { demoAPI } from '../../lib/api'

export default function Dashboard({ user, demoMode }) {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    pendingOrders: 0,
    alerts: 0
  })
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [demoMode])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      if (demoMode) {
        // Données de démonstration
        setStats({
          totalProducts: 156,
          lowStock: 8,
          pendingOrders: 12,
          alerts: 3
        })
        
        const alertsData = await demoAPI.getAlerts()
        setAlerts(alertsData.alerts)
      } else {
        try {
          const alertsData = await stockAPI.getAlerts()
          setAlerts(alertsData.alerts || [])
          
          // Calcul des statistiques basé sur les données réelles
          setStats({
            totalProducts: 156, // À calculer depuis l'API
            lowStock: alertsData.alerts?.filter(a => a.type === 'stock').length || 0,
            pendingOrders: 12, // À calculer depuis l'API
            alerts: alertsData.alerts?.length || 0
          })
        } catch (error) {
          console.warn('Erreur API, basculement en mode démo')
          const alertsData = await demoAPI.getAlerts()
          setAlerts(alertsData.alerts)
          setStats({
            totalProducts: 156,
            lowStock: 8,
            pendingOrders: 12,
            alerts: 3
          })
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du tableau de bord:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Produits Actifs',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Stock Faible',
      value: stats.lowStock,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '-5%',
      changeType: 'negative'
    },
    {
      title: 'Commandes en Cours',
      value: stats.pendingOrders,
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Alertes Actives',
      value: stats.alerts,
      icon: Activity,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      change: 'Nouveau',
      changeType: 'neutral'
    }
  ]

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'destructive'
      case 'warning': return 'default'
      case 'info': return 'secondary'
      default: return 'default'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
        <p className="text-gray-600">
          Bienvenue, {user.full_name || user.username} - Vue d'ensemble de votre laboratoire
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm ${
                        stat.changeType === 'positive' ? 'text-green-600' :
                        stat.changeType === 'negative' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
              Alertes Récentes
            </CardTitle>
            <CardDescription>
              Notifications importantes nécessitant votre attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.length > 0 ? (
                alerts.map((alert, index) => (
                  <Alert key={index} variant={getSeverityColor(alert.severity)}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex justify-between items-start">
                        <span>{alert.message}</span>
                        <Badge variant={getSeverityColor(alert.severity)} className="ml-2">
                          {alert.severity}
                        </Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Aucune alerte active</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Actions Rapides
            </CardTitle>
            <CardDescription>
              Raccourcis vers les tâches courantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <Package className="w-6 h-6 text-blue-600 mb-2" />
                <p className="font-medium text-sm">Nouveau Produit</p>
                <p className="text-xs text-gray-500">Ajouter un produit chimique</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <ShoppingCart className="w-6 h-6 text-green-600 mb-2" />
                <p className="font-medium text-sm">Nouvelle Commande</p>
                <p className="text-xs text-gray-500">Créer une demande d'achat</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <Users className="w-6 h-6 text-purple-600 mb-2" />
                <p className="font-medium text-sm">Gestion Utilisateurs</p>
                <p className="text-xs text-gray-500">Gérer les accès</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <Calendar className="w-6 h-6 text-orange-600 mb-2" />
                <p className="font-medium text-sm">Planification</p>
                <p className="text-xs text-gray-500">Calendrier des tâches</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité Récente</CardTitle>
          <CardDescription>
            Dernières actions effectuées dans le système
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Nouveau produit ajouté', item: 'Acide Chlorhydrique 37%', time: 'Il y a 2 heures', user: 'Marie Dubois' },
              { action: 'Commande validée', item: 'Commande #CMD-2024-001', time: 'Il y a 4 heures', user: 'Jean Martin' },
              { action: 'Stock mis à jour', item: 'Éthanol Absolu', time: 'Il y a 6 heures', user: 'Sophie Laurent' },
              { action: 'Contrôle qualité', item: 'Lot LOT-2024-045', time: 'Hier', user: 'Pierre Durand' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.item}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{activity.time}</p>
                  <p className="text-xs text-gray-400">{activity.user}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


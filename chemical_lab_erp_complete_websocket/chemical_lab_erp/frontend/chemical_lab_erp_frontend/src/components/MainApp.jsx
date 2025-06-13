import { useState, useEffect } from 'react'
import { 
  Beaker, 
  Home, 
  Package, 
  Truck, 
  FileText, 
  Settings, 
  MessageSquare, 
  MessageCircle,
  Bell,
  User,
  LogOut,
  Search,
  Plus,
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Alert, AlertDescription } from './ui/alert'
import { Avatar, AvatarFallback } from './ui/avatar'

// Import des composants de section
import Dashboard from './sections/Dashboard'
import Products from './sections/Products'
import Suppliers from './sections/Suppliers'
import Stock from './sections/Stock'
import Reports from './sections/Reports'
import { default as SettingsPage } from './sections/Settings'
import Forum from './sections/Forum'
import Chat from './sections/Chat'

export default function MainApp({ user, onLogout, demoMode }) {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [notifications, setNotifications] = useState([])

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: Home },
    { id: 'products', label: 'Produits', icon: Beaker },
    { id: 'suppliers', label: 'Fournisseurs', icon: Truck },
    { id: 'stock', label: 'Stocks', icon: Package },
    { id: 'reports', label: 'Rapports', icon: FileText },
    { id: 'settings', label: 'Paramètres', icon: Settings },
    { id: 'forum', label: 'Forum', icon: MessageSquare },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
  ]

  const renderSection = () => {
    const sectionProps = { user, demoMode }
    
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard {...sectionProps} />
      case 'products':
        return <Products {...sectionProps} />
      case 'suppliers':
        return <Suppliers {...sectionProps} />
      case 'stock':
        return <Stock {...sectionProps} />
      case 'reports':
        return <Reports {...sectionProps} />
      case 'settings':
        return <SettingsPage {...sectionProps} />
      case 'forum':
        return <Forum {...sectionProps} />
      case 'chat':
        return <Chat {...sectionProps} />
      default:
        return <Dashboard {...sectionProps} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Beaker className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Chemical Lab ERP</h1>
                {demoMode && (
                  <Badge variant="secondary" className="text-xs">Mode Démo</Badge>
                )}
              </div>
            </div>

            {/* Search */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher un produit, fournisseur..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* User menu */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {notifications.length}
                  </Badge>
                )}
              </Button>

              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>
                    {user.full_name?.split(' ').map(n => n[0]).join('') || user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.full_name || user.username}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </div>

              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Quick stats */}
          <div className="p-4 border-t border-gray-200 mt-8">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Aperçu Rapide</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Produits actifs</span>
                <span className="font-medium">156</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Alertes</span>
                <span className="font-medium text-orange-600">3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Commandes</span>
                <span className="font-medium">12</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  )
}


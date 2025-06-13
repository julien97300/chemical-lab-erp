import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Settings as SettingsIcon, User, Shield, Bell, Database } from 'lucide-react'

export default function Settings({ user, demoMode }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <SettingsIcon className="w-8 h-8 mr-2" />
          Paramètres
        </h1>
        <p className="text-gray-600">Configuration du système</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'Profil Utilisateur', description: 'Gérer vos informations personnelles', icon: User },
          { title: 'Sécurité', description: 'Mots de passe et authentification', icon: Shield },
          { title: 'Notifications', description: 'Préférences de notification', icon: Bell },
          { title: 'Base de Données', description: 'Sauvegarde et maintenance', icon: Database }
        ].map((setting, index) => {
          const Icon = setting.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon className="w-5 h-5 mr-2 text-blue-600" />
                  {setting.title}
                </CardTitle>
                <CardDescription>{setting.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </div>
  )
}


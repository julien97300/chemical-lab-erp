import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { FileText, Download, Calendar, TrendingUp } from 'lucide-react'
import { Button } from '../ui/button'

export default function Reports({ user, demoMode }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <FileText className="w-8 h-8 mr-2" />
          Rapports et Analyses
        </h1>
        <p className="text-gray-600">Générez et consultez vos rapports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Rapport d\'Inventaire', description: 'État complet des stocks', icon: FileText },
          { title: 'Analyse des Coûts', description: 'Évolution des dépenses', icon: TrendingUp },
          { title: 'Rapport de Sécurité', description: 'Incidents et conformité', icon: FileText },
          { title: 'Rapport Mensuel', description: 'Synthèse du mois', icon: Calendar },
          { title: 'Analyse Fournisseurs', description: 'Performance des partenaires', icon: FileText },
          { title: 'Rapport Qualité', description: 'Contrôles et certifications', icon: FileText }
        ].map((report, index) => {
          const Icon = report.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Icon className="w-5 h-5 mr-2 text-blue-600" />
                  {report.title}
                </CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Générer
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}


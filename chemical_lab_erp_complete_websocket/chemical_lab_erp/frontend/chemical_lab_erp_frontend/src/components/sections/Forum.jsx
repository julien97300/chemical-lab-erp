import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { MessageSquare, Plus, Users, Clock } from 'lucide-react'
import { Button } from '../ui/button'

export default function Forum({ user, demoMode }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="w-8 h-8 mr-2" />
            Forum de Discussion
          </h1>
          <p className="text-gray-600">Échangez avec votre équipe</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Sujet
        </Button>
      </div>

      <div className="space-y-4">
        {[
          { title: 'Procédures de sécurité mises à jour', author: 'Marie Dubois', replies: 5, time: 'Il y a 2h' },
          { title: 'Nouveau fournisseur de solvants', author: 'Jean Martin', replies: 12, time: 'Il y a 4h' },
          { title: 'Formation manipulation produits dangereux', author: 'Sophie Laurent', replies: 8, time: 'Hier' }
        ].map((topic, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{topic.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {topic.author}
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {topic.replies} réponses
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {topic.time}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


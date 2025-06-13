import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { MessageCircle, Send, Users, Wifi, WifiOff } from 'lucide-react'
import { chatAPI, usersAPI, demoAPI, getSocket, initializeSocket } from '../../lib/api'

export default function Chat({ user, demoMode }) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState({})
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const socketRef = useRef(null)

  useEffect(() => {
    loadInitialData()
    
    if (!demoMode) {
      setupWebSocket()
    }
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [user, demoMode])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      
      if (demoMode) {
        const [messagesData, usersData] = await Promise.all([
          demoAPI.getChatMessages(),
          demoAPI.getOnlineUsers()
        ])
        setMessages(messagesData.messages)
        setOnlineUsers(usersData.users)
      } else {
        try {
          const [messagesData, usersData] = await Promise.all([
            chatAPI.getMessages(),
            usersAPI.getOnlineUsers()
          ])
          setMessages(messagesData.messages || [])
          setOnlineUsers(usersData.users || [])
        } catch (error) {
          console.log('Backend not available, using demo data')
          const [messagesData, usersData] = await Promise.all([
            demoAPI.getChatMessages(),
            demoAPI.getOnlineUsers()
          ])
          setMessages(messagesData.messages)
          setOnlineUsers(usersData.users)
        }
      }
    } catch (error) {
      console.error('Error loading chat data:', error)
    } finally {
      setLoading(false)
    }
  }

  const setupWebSocket = () => {
    try {
      const socket = initializeSocket(user)
      socketRef.current = socket

      socket.on('connect', () => {
        setIsConnected(true)
        console.log('WebSocket connected')
      })

      socket.on('disconnect', () => {
        setIsConnected(false)
        console.log('WebSocket disconnected')
      })

      socket.on('new_message', (messageData) => {
        setMessages(prev => [...prev, messageData])
      })

      socket.on('user_typing', (data) => {
        if (data.username !== user.username) {
          setIsTyping(prev => ({
            ...prev,
            [data.username]: data.is_typing
          }))
          
          if (data.is_typing) {
            setTimeout(() => {
              setIsTyping(prev => ({
                ...prev,
                [data.username]: false
              }))
            }, 3000)
          }
        }
      })

      socket.on('status', (data) => {
        console.log('Status:', data.msg)
      })

      socket.on('error', (error) => {
        console.error('Socket error:', error)
      })

    } catch (error) {
      console.error('Error setting up WebSocket:', error)
      setIsConnected(false)
    }
  }

  const sendMessage = () => {
    if (message.trim()) {
      if (demoMode || !isConnected) {
        // Demo mode or offline - add message locally
        const newMessage = {
          id: Date.now(),
          user_id: user.id,
          username: user.username,
          full_name: user.full_name,
          message: message,
          timestamp: new Date().toISOString(),
          room: 'general'
        }
        setMessages(prev => [...prev, newMessage])
      } else {
        // Real-time mode - send via WebSocket
        chatAPI.sendMessage(user, message, 'general')
      }
      
      setMessage('')
      stopTyping()
    }
  }

  const handleTyping = (e) => {
    setMessage(e.target.value)
    
    if (!demoMode && isConnected) {
      chatAPI.setTyping(user, true, 'general')
      
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping()
      }, 1000)
    }
  }

  const stopTyping = () => {
    if (!demoMode && isConnected) {
      chatAPI.setTyping(user, false, 'general')
    }
    clearTimeout(typingTimeoutRef.current)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTypingUsers = () => {
    return Object.entries(isTyping)
      .filter(([username, typing]) => typing && username !== user.username)
      .map(([username]) => username)
  }

  if (loading) {
    return <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <MessageCircle className="w-8 h-8 mr-2" />
            Chat en Temps Réel
            {!demoMode && (
              <Badge variant={isConnected ? "default" : "destructive"} className="ml-3">
                {isConnected ? (
                  <>
                    <Wifi className="w-3 h-3 mr-1" />
                    Connecté
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 mr-1" />
                    Déconnecté
                  </>
                )}
              </Badge>
            )}
            {demoMode && (
              <Badge variant="secondary" className="ml-3">
                Mode Démo
              </Badge>
            )}
          </h1>
          <p className="text-gray-600">
            {demoMode 
              ? "Communication simulée avec votre équipe" 
              : "Communication en temps réel avec votre équipe"
            }
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Users list */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Users className="w-5 h-5 mr-2" />
              En ligne ({onlineUsers.filter(u => u.is_online !== false).length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {onlineUsers.map((onlineUser) => (
                <div key={onlineUser.id} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    onlineUser.is_online !== false ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <span className={`text-sm ${
                    onlineUser.username === user.username ? 'font-semibold text-blue-600' : ''
                  }`}>
                    {onlineUser.full_name}
                    {onlineUser.username === user.username && ' (Vous)'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Discussion Générale</span>
              {!demoMode && !isConnected && (
                <Badge variant="outline" className="text-orange-600">
                  Mode Hors Ligne
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 h-96 overflow-y-auto mb-4 p-2 border rounded-lg bg-gray-50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${
                  msg.username === user.username ? 'justify-end' : 'justify-start'
                }`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.username === user.username 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-900 border'
                  }`}>
                    {msg.username !== user.username && (
                      <p className="text-xs font-semibold mb-1 text-gray-600">
                        {msg.full_name}
                      </p>
                    )}
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${
                      msg.username === user.username ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Typing indicators */}
              {getTypingUsers().length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm">
                    <span className="italic">
                      {getTypingUsers().join(', ')} {getTypingUsers().length === 1 ? 'tape' : 'tapent'}...
                    </span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div className="flex space-x-2">
              <Input
                placeholder="Tapez votre message..."
                value={message}
                onChange={handleTyping}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage()
                  }
                }}
                className="flex-1"
                disabled={!demoMode && !isConnected}
              />
              <Button 
                onClick={sendMessage}
                disabled={!message.trim() || (!demoMode && !isConnected)}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {!demoMode && !isConnected && (
              <p className="text-sm text-orange-600 mt-2">
                ⚠️ Connexion WebSocket indisponible. Les messages ne seront pas synchronisés en temps réel.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


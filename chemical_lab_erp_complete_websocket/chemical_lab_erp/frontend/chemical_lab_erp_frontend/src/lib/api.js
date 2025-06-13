import { io } from 'socket.io-client'

// API configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-domain.com/api' 
  : 'http://localhost:5001/api'

const SOCKET_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-backend-domain.com'
  : 'http://localhost:5001'

// Socket.IO client
let socket = null

export const initializeSocket = (user) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    })
    
    socket.on('connect', () => {
      console.log('Connected to WebSocket server')
      // Join general room
      socket.emit('join_room', {
        room: 'general',
        username: user.username
      })
    })
    
    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server')
    })
    
    socket.on('error', (error) => {
      console.error('Socket error:', error)
    })
  }
  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

// Token management
export const setToken = (token) => {
  localStorage.setItem('token', token)
}

export const getToken = () => {
  return localStorage.getItem('token')
}

export const removeToken = () => {
  localStorage.removeItem('token')
}

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error)
    throw error
  }
}

// Authentication API
export const authAPI = {
  login: async (username, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
  },
  
  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST'
    })
  }
}

// Chat API
export const chatAPI = {
  getMessages: async (room = 'general', limit = 50) => {
    return apiRequest(`/chat/messages?room=${room}&limit=${limit}`)
  },
  
  sendMessage: (user, message, room = 'general') => {
    if (socket) {
      socket.emit('send_message', {
        user_id: user.id,
        room: room,
        message: message
      })
    }
  },
  
  joinRoom: (user, room = 'general') => {
    if (socket) {
      socket.emit('join_room', {
        room: room,
        username: user.username
      })
    }
  },
  
  leaveRoom: (user, room = 'general') => {
    if (socket) {
      socket.emit('leave_room', {
        room: room,
        username: user.username
      })
    }
  },
  
  setTyping: (user, isTyping, room = 'general') => {
    if (socket) {
      socket.emit('user_typing', {
        username: user.username,
        is_typing: isTyping,
        room: room
      })
    }
  }
}

// Users API
export const usersAPI = {
  getOnlineUsers: async () => {
    return apiRequest('/users/online')
  }
}

// Products API
export const productsAPI = {
  getAll: async () => {
    return apiRequest('/products')
  }
}

// Suppliers API
export const suppliersAPI = {
  getAll: async () => {
    return apiRequest('/suppliers')
  }
}

// Demo API (fallback when backend is not available)
export const demoAPI = {
  login: async (username, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const users = {
      'admin': { id: 1, username: 'admin', role: 'Admin', full_name: 'Administrateur', email: 'admin@lab.com' },
      'coord': { id: 2, username: 'coord', role: 'Coordinateur', full_name: 'Coordinateur Lab', email: 'coord@lab.com' },
      'prof': { id: 3, username: 'prof', role: 'Enseignant', full_name: 'Professeur Martin', email: 'prof@lab.com' },
      'tech': { id: 4, username: 'tech', role: 'Technicien', full_name: 'Technicien Lab', email: 'tech@lab.com' },
      'visit': { id: 5, username: 'visit', role: 'Visiteur', full_name: 'Visiteur', email: 'visit@lab.com' }
    }
    
    const passwords = {
      'admin': 'admin123',
      'coord': 'coord123',
      'prof': 'prof123',
      'tech': 'tech123',
      'visit': 'visit123'
    }
    
    if (users[username] && passwords[username] === password) {
      const token = `demo-token-${username}-${Date.now()}`
      return {
        token,
        user: users[username]
      }
    } else {
      throw new Error('Invalid credentials')
    }
  },

  getProducts: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      products: [
        {
          id: 1,
          name: 'Acide Sulfurique',
          reference: 'H2SO4-98',
          cas_number: '7664-93-9',
          formula: 'H₂SO₄',
          molecular_weight: 98.08,
          category: 'Acides',
          supplier_name: 'Sigma-Aldrich',
          unit_price: 25.50,
          stock_quantity: 15.5,
          min_stock_level: 5.0,
          storage_conditions: 'Stocker dans un endroit frais et sec',
          safety_info: 'H314: Provoque des brûlures de la peau'
        },
        {
          id: 2,
          name: 'Éthanol Absolu',
          reference: 'ETH-ABS-99',
          cas_number: '64-17-5',
          formula: 'C₂H₅OH',
          molecular_weight: 46.07,
          category: 'Solvants',
          supplier_name: 'VWR International',
          unit_price: 18.75,
          stock_quantity: 8.2,
          min_stock_level: 10.0,
          storage_conditions: 'Stocker à température ambiante',
          safety_info: 'H225: Liquide et vapeurs très inflammables'
        },
        {
          id: 3,
          name: 'Hydroxyde de Sodium',
          reference: 'NAOH-PURE',
          cas_number: '1310-73-2',
          formula: 'NaOH',
          molecular_weight: 39.997,
          category: 'Bases',
          supplier_name: 'Merck KGaA',
          unit_price: 12.30,
          stock_quantity: 25.0,
          min_stock_level: 5.0,
          storage_conditions: 'Stocker dans un récipient hermétique',
          safety_info: 'H314: Provoque des brûlures de la peau'
        }
      ]
    }
  },

  getSuppliers: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      suppliers: [
        {
          id: 1,
          name: 'Sigma-Aldrich',
          code: 'SIG001',
          contact_person: 'Marie Dubois',
          email: 'contact@sigma-aldrich.com',
          phone: '+33 1 23 45 67 89',
          website: 'www.sigma-aldrich.com',
          supplier_type: 'Premium',
          reliability_score: 4.8,
          specialties: 'Produits chimiques de haute pureté, réactifs analytiques'
        },
        {
          id: 2,
          name: 'VWR International',
          code: 'VWR001',
          contact_person: 'Jean Martin',
          email: 'contact@vwr.com',
          phone: '+33 1 34 56 78 90',
          website: 'www.vwr.com',
          supplier_type: 'Standard',
          reliability_score: 4.5,
          specialties: 'Équipements de laboratoire, consommables'
        },
        {
          id: 3,
          name: 'Merck KGaA',
          code: 'MER001',
          contact_person: 'Sophie Laurent',
          email: 'contact@merck.com',
          phone: '+33 1 45 67 89 01',
          website: 'www.merck.com',
          supplier_type: 'Premium',
          reliability_score: 4.9,
          specialties: 'Produits pharmaceutiques, biotechnologie'
        }
      ]
    }
  },

  getOnlineUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      users: [
        { id: 1, username: 'admin', full_name: 'Administrateur', is_online: true },
        { id: 2, username: 'coord', full_name: 'Coordinateur Lab', is_online: true },
        { id: 3, username: 'prof', full_name: 'Professeur Martin', is_online: true },
        { id: 4, username: 'tech', full_name: 'Technicien Lab', is_online: false }
      ]
    }
  },

  getChatMessages: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      messages: [
        {
          id: 1,
          user_id: 2,
          username: 'coord',
          full_name: 'Coordinateur Lab',
          message: 'Bonjour à tous ! Comment ça va aujourd\'hui ?',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          room: 'general'
        },
        {
          id: 2,
          user_id: 3,
          username: 'prof',
          full_name: 'Professeur Martin',
          message: 'Salut ! Tout va bien, merci. Avez-vous vu les nouvelles procédures ?',
          timestamp: new Date(Date.now() - 3000000).toISOString(),
          room: 'general'
        },
        {
          id: 3,
          user_id: 4,
          username: 'tech',
          full_name: 'Technicien Lab',
          message: 'Oui, je les ai consultées. Très utiles !',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          room: 'general'
        }
      ]
    }
  }
}


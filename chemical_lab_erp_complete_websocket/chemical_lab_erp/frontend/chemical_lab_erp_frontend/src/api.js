const API_BASE_URL = 'http://localhost:5001/api';

export async function login(username, password) {
  const response = await fetch(\`\${API_BASE_URL}/auth/login\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }
  return response.json();
}

export async function fetchProducts(token) {
  const response = await fetch(\`\${API_BASE_URL}/products\`, {
    headers: { Authorization: \`Bearer \${token}\` },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

// Additional API functions for suppliers, orders, chat, etc. can be added here

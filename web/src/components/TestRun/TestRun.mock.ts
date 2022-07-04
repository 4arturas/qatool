// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  servers: [
    { id: 42, name: 'server1', address: 'address', method: 'POST', header: '{}' },
    { id: 43, name: 'server2', address: 'address', method: 'POST', header: '{}' },
    { id: 44, name: 'server3', address: 'address', method: 'POST', header: '{}' },
    { id: 45, name: 'server4', address: 'address', method: 'POST', header: '{}' },
  ],
  body: { id: 1 },
  test: { id: 2 },
  replace: { id: 3 },
  remove: { id: 4 },
  result: { id: 5, jsonata: 'jsonata' },
})

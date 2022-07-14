// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  users: [
    {"__typename":"User","id":1,"email":"a","userRoles":[{"__typename":"UserRole","name":"admin"}]},
    {"__typename":"User","id":2,"email":"c","userRoles":[{"__typename":"UserRole","name":"customer"}]}
  ],
})

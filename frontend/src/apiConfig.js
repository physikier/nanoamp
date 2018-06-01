// defaults to production environment
let BACKEND_API = '';

const host = window && window.location && window.location.host;
if (host === 'localhost:3000') {
  // development environment
  BACKEND_API = 'http://localhost:5000';
}

export default BACKEND_API;
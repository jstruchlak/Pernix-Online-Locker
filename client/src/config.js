const config = {
  production: process.env.NODE_ENV === 'production',
  apiServer: process.env.REACT_APP_API_SERVER || 'http://localhost:4000',
  isMock: false
};

console.log('API Server URL:', config.apiServer);

export default config;

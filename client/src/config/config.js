const config = {
    production: process.env.NODE_ENV === 'production',
    apiServer: process.env.REACT_APP_API_SERVER || 'https://pernix-api-locker.azurewebsites.net', 
    isMock: false
  };
  
  console.log('API Server is URL:', config.apiServer);
  
  export default config;
  
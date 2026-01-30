import axios from 'axios';

// Create a proxy middleware for microservices
export const createProxy = (serviceUrl) => {
  return async (req, res) => {
    try {
      if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
      }

      const url = `${serviceUrl}${req.originalUrl}`;
      
      const headersToForward = { ...req.headers };
      delete headersToForward['host'];
      delete headersToForward['content-length'];
      
      // Forward the request to the microservice
      const response = await axios({
        method: req.method,
        url: url,
        data: req.body,
        headers: {
          ...headersToForward,
          'Content-Type': 'application/json',
        },
        params: req.query,
        validateStatus: () => true, // Don't throw on any status
      });

      // Copy response headers from microservice
      Object.keys(response.headers).forEach(key => {
        if (!['content-encoding', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) {
          res.setHeader(key, response.headers[key]);
        }
      });

      // Forward the response back to client
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Proxy error:', error.message);
      
      if (error.response) {
        // Forward error response from microservice
        res.status(error.response.status).json(error.response.data);
      } else {
        // Service unavailable
        res.status(503).json({
          success: false,
          message: 'Service temporarily unavailable',
          error: error.message,
        });
      }
    }
  };
};

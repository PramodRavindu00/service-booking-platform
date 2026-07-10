import { Params } from 'nestjs-pino';

const isProd = process.env.NODE_ENV === 'production';

export const pinoHttpConfig: Params = {
  pinoHttp: {
    level: isProd ? 'info' : 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        singleLine: true,
        levelFirst: true,
        ignore: 'pid,hostname,time,req,res,responseTime',
        messageFormat: '{msg}',
      },
    },
    redact: {
      paths: ['req.headers.authorization', 'req.headers.cookie'],
      remove: true,
    },
    customLogLevel: (_req, res, err) => {
      if (err || res.statusCode >= 400) return 'error';
      return 'info';
    },
    customSuccessMessage(req, res, responseTime) {
      return `${req.method} ${req.url} ${res.statusCode} Completed in: ${responseTime}ms`;
    },
    customErrorMessage(req, _res, err) {
      return `${req.method} ${req.url} Failed: ${err.message}`;
    },
  },
};

import { JobEntity } from '@modules/routes/jobs/entities/job.entity';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Job } from '@prisma/client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Builder } from 'xml2js';

@Injectable()
export class IndeedXmlInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const builder = new Builder({
          headless: true,
          rootName: 'job',
          cdata: true,
        });

        if (!Array.isArray(data)) {
          throw new Error('Expected an array of objects');
        }

        const xmlObjects = data.map((job: Job) => {
          const formattedJob = {
            ...job,
            publishedDate: job.updatedAt?.toISOString(),
            expirationDate: job.createdAt?.toISOString(),
            lastActivityDate: job.createdAt?.toISOString(),
          } as any;

          return builder.buildObject(
            Object.entries(formattedJob).map((item) => {
              if (!['id', 'updatedAt', 'createdAt'].includes(item[0])) {
                const remapNameForIndeed = () => {
                  const name = item[0] as keyof Partial<JobEntity>;
                  switch (name) {
                    case 'trackingUrl':
                      return 'tracking_url';
                    case 'publishedDate':
                      return 'date';
                    default:
                      return name.toLowerCase();
                  }
                };
                const object = {};
                object[`${remapNameForIndeed()}`] = `${item[1]}`;
                return { ...object };
              }
            }),
          );
        });

        const response = context.switchToHttp().getResponse();
        response.setHeader('Content-Type', 'application/xml');

        const xmlString = [
          '<?xml version="1.0" encoding="utf-8"?>',
          '<source>',
          '<publisher>ATS Name</publisher>',
          '<publisherurl>http://www.atssite.com</publisherurl>',
          xmlObjects,
          '</source>',
        ].join('');

        return xmlString;
      }),
    );
  }
}

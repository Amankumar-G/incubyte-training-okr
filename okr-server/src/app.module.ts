import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { KeyResultsModule } from './key-results/key-results.module';
import { OkrModule } from './okr/okr.module';
import { ObjectiveModule } from './objective/objective.module';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './middleware/auth.middleware';
@Module({
  imports: [
    OkrModule,
    KeyResultsModule,
    ObjectiveModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/objectives', method: RequestMethod.ALL });
  }
}

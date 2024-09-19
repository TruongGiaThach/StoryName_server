import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MetadataModule } from './metadata/metadata.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { config } from 'dotenv';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { NameModule } from './name/name.module';
import { CommitmentModule } from './commitment/commitment.module';
import { RecordModule } from './record/record.module';
import configuration from './configuration';
import { ChainModule } from './chain/chain.module';
import { AppLoggerMiddleware } from './utils/middleware/app-logger.middleware';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './modules/jwt/jwt.strategy';
import { User, UserSchema } from './models/user.schema';

config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MetadataModule,
    UserModule,
    AuthModule,
    NameModule,
    CommitmentModule,
    RecordModule,
    ChainModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}

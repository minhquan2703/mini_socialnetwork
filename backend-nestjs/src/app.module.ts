import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { LikesModule } from './modules/likes/likes.module';
import { PhotosModule } from './modules/photos/photos.module';
import { MessagesModule } from './modules/messages/messages.module';
import { AuthsModule } from './auths/auths.module';
import { User } from './modules/users/entities/user.entity';
import { Photo } from './modules/photos/entities/photo.entity';
import { Message } from './modules/messages/entities/message.entity';
import { Comment } from './modules/comments/entities/comment.entity';
import { Like } from './modules/likes/entities/like.entity';
import { Post } from './modules/posts/entities/post.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './core/transform.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
        entities: [User, Photo, Message, Comment, Like, Post],
      }),
    }),
    UsersModule,
    PostsModule,
    CommentsModule,
    LikesModule,
    PhotosModule,
    MessagesModule,
    AuthsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}

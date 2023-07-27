import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriaSchema } from './interfaces/categorias/categoria.schema';
import { JogadorSchema } from './interfaces/jogadores/jogador.schema';
import { ConnectOptions } from "mongoose";

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://admin:36215369@cluster0.02fqell.mongodb.net/microranking?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true} as ConnectOptions),
    MongooseModule.forFeature([
      { name: 'Categoria', schema: CategoriaSchema},
      { name: 'Jogador', schema: JogadorSchema}
    ])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
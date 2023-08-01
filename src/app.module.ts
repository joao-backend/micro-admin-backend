import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriaSchema } from './categorias/intefaces/categoria.schema';
import { JogadorSchema } from './jogadores/interfaces/jogador.schema';
import { ConnectOptions } from "mongoose";
import { JogadoresModule } from './jogadores/jogadores.module';
import { CategoriasModule } from './categorias/categorias.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://admin:36215369@cluster0.02fqell.mongodb.net/microranking?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true} as ConnectOptions),
    MongooseModule.forFeature([
      { name: 'Categoria', schema: CategoriaSchema},
      { name: 'Jogador', schema: JogadorSchema}
    ]),
    JogadoresModule,
    CategoriasModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
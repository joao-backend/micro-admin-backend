import { Controller, Logger } from '@nestjs/common';
import { JogadoresService } from './jogadores.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Jogador } from './interfaces/jogador.interface';

@Controller('jogadores')
export class JogadoresController {
    constructor(private readonly jogadorService: JogadoresService) {}

  logger = new Logger(JogadoresController.name);

  @EventPattern('criar-jogadro')
  async criarJogador(
    @Payload() jogador: Jogador,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.jogadorService.criarJogador(jogador);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMsg);
      }
    }
  }

  @MessagePattern('consultar-categorias')
  async consultarCategorias(
    @Payload() _id: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      if (_id) {
        return await this.categoriaService.consultarCategoriaPeloId(_id);
      } else {
        return await this.categoriaService.consultarTodasCategorias();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('atualizar-categoria')
  async atualizarCategoria(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    this.logger.log(`data: ${JSON.stringify(data)}`);

    try {
      const _id: string = data.id;
      const categoria: Categoria = data.categoria;
      await this.categoriaService.atualizarCategoria(_id, categoria);
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMsg);
      }
    }
  }

  @MessagePattern('deletar-categoria')
  async deletarCategoria(
    @Payload() _id: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      return await this.categoriaService.deletarCategoria(_id)
    } finally {
      await channel.ack(originalMsg);
    }
  }
}

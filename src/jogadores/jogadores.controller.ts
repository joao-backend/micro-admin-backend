import { Controller, Logger } from '@nestjs/common';
import { JogadoresService } from './jogadores.service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Jogador } from './interfaces/jogador.interface';

const ackErrors: string[] = ['E11000'];

@Controller('jogadores')
export class JogadoresController {
    constructor(private readonly jogadorService: JogadoresService) {}

  logger = new Logger(JogadoresController.name);

  @EventPattern('criar-jogador')
  async criarJogador(
    @Payload() jogador: Jogador,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      console.log(jogador)
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

  @MessagePattern('consultar-jogadores')
  async consultarJogadores(
    @Payload() _id: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      if (_id) {
        return await this.jogadorService.consultarJogadorPeloId(_id);
      } else {
        return await this.jogadorService.consultarTodosJogadores();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('atualizar-jogador')
  async atualizarJogador(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    this.logger.log(`data: ${JSON.stringify(data)}`);

    try {
      const _id: string = data.id;
      const jogador: Jogador = data.jogador;
      await this.jogadorService.atualizarJogador(_id, jogador);
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

  @MessagePattern('deletar-jogador')
  async deletarJogador(
    @Payload() _id: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      return await this.jogadorService.deletarJogador(_id)
    } finally {
      await channel.ack(originalMsg);
    }
  }
}

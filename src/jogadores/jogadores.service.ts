import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];
  private readonly logger = new Logger(JogadoresService.name);

  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async criarAtualizarJogador(criaJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criaJogadorDto;

    // const jogadorEncontrado = this.jogadores.find(
    //   (jogador) => jogador.email === email,
    // );

    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (jogadorEncontrado) {
      this.atualizar(criaJogadorDto);
    }

    if (!jogadorEncontrado) {
      this.criar(criaJogadorDto);
    }
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    // return this.jogadores;

    return await this.jogadorModel.find().exec();
  }

  async consultarJogadorPeloEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com e-mail ${email} não encontrado`);
    }

    return jogadorEncontrado;
  }

  async deletarJogador(email: string): Promise<any> {
    // const jogadorEncontrado = this.jogadores.find(
    //   (jogador) => jogador.email === email,
    // );
    // this.jogadores = this.jogadores.filter(
    //   (jogador) => jogador.email !== jogadorEncontrado.email,
    // );

    return await this.jogadorModel.remove({ email }).exec();
  }

  private async atualizar(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    return await this.jogadorModel
      .findOneAndUpdate(
        { email: criarJogadorDto.email },
        { $set: criarJogadorDto },
      )
      .exec();

    // const { nome } = criarJogadorDto;

    // jogadorEncontrado.nome = nome;
  }

  private async criar(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const jogadorCriado = new this.jogadorModel(criaJogadorDto);

    return await jogadorCriado.save();

    // const { nome, telefoneCelular, email } = criaJogadorDto;

    // const jogador: Jogador = {
    //   _id: uuidv4(),
    //   nome,
    //   telefoneCelular,
    //   email,
    //   ranking: 'A',
    //   posicaoRanking: 1,
    //   urlFotoJogador: 'www.google.com.br/foto123.jpg',
    // };

    // this.logger.log(`jogador: ${JSON.stringify(jogador)}`);

    // this.jogadores.push(jogador);
  }
}

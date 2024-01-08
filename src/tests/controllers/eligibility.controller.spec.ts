import * as httpStatus from 'http-status';
import request from 'supertest';
import { App } from '../../app';
import { TiposDeConexaoEnum } from '../../services/types/eligibility.type';

describe('EligibilityController', () => {
  it('should respond with unprocessable entity', async () => {
    const invalidRequest = {
      classeDeConsumo: 'InvalidClass',
      modalidadeTarifaria: 'ValidTariff',
      historicoDeConsumo: [100, 150, 200],
      tipoDeConexao: 'InvalidConnectionType',
    };

    await request(App)
      .post('/v1/eligibility')
      .send(invalidRequest)
      .expect(httpStatus.UNPROCESSABLE_ENTITY);
  });
  
  it('should respond with not eligible and reasons for invalid input', async () => {
    const invalidRequest = {
      numeroDoDocumento: '14041737706',
      tipoDeConexao: 'bifasico',
      classeDeConsumo: 'rural',
      modalidadeTarifaria: 'verde',
      historicoDeConsumo: [
        3878,
        9760,
        5976,
        2797,
        2481,
        5731,
        7538,
        4392,
        7859,
        4160,
      ]
    };

    const response = await request(App)
      .post('/v1/eligibility')
      .send(invalidRequest)
      .expect(httpStatus.OK);

    expect(response.body).toEqual({
      elegivel: false,
      razoesDeInelegibilidade: expect.any(Array),
    });
  });

  it('should respond with eligible and CO2 savings for valid input', async () => {
    const validRequest = {
      numeroDoDocumento: '14041737706',
      tipoDeConexao: TiposDeConexaoEnum.Bifasico,
      classeDeConsumo: 'comercial',
      modalidadeTarifaria: 'convencional',
      historicoDeConsumo: [
        3878,
        9760,
        5976,
        2797,
        2481,
        5731,
        7538,
        4392,
        7859,
        4160,
        6941,
        4597,
      ]
    };

    const response = await request(App)
      .post('/v1/eligibility')
      .send(validRequest)
      .expect(httpStatus.OK);

    expect(response.body).toEqual({
      elegivel: true,
      economiaAnualDeCO2: expect.any(Number),
    });
  });
});

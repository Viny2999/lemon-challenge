import { EligibilityService } from '../../services';
import { RazoesEnum, TiposDeConexaoEnum } from '../../services/types/eligibility.type';

describe('EligibilityService', () => {
  let eligibilityService;

  beforeEach(() => {
    eligibilityService = new EligibilityService();
  });

  describe('checkEligibility', () => {
    it('should return not eligible with reasons for invalid consumption class', () => {
      const req = {
        body: {
          classeDeConsumo: 'InvalidClass',
          modalidadeTarifaria: 'ValidTariff',
          historicoDeConsumo: [100, 150, 200],
          tipoDeConexao: TiposDeConexaoEnum.Monofasico,
        },
      };

      const res = {
        send: jest.fn(),
      };

      eligibilityService.checkEligibility(req, res);

      expect(res.send).toHaveBeenCalledWith({
        elegivel: false,
        razoesDeInelegibilidade: [
          RazoesEnum.ClasseConsumo,
          RazoesEnum.ModalidadeTarifaria,
          RazoesEnum.ConsumoMinimo
        ],
      });
    });

    it('should return eligible with annual CO2 savings for valid input', () => {
      const req = {
        body: {
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
        },
      };

      const res = {
        send: jest.fn(),
      };

      eligibilityService.checkEligibility(req, res);

      const expectedResponse = {
        elegivel: true,
        economiaAnualDeCO2: expect.any(Number),
      };

      expect(res.send).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe('getTotalHistoricoDeConsumo', () => {
    it('should return total consumption for a given historical consumption array', () => {
      const historicoDeConsumo = [100, 150, 200];
      const totalConsumption = eligibilityService.getTotalHistoricoDeConsumo(historicoDeConsumo);

      expect(totalConsumption).toBe(450);
    });
  });

  describe('calculateEconomyAnnualCO2', () => {
    it('should return the correct annual CO2 savings based on consumption history', () => {
      const historicoDeConsumo = [
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
      ];
      const expectedCO2Savings = 5553.24;
      const result = eligibilityService.calculateEconomyAnnualCO2(historicoDeConsumo);

      expect(result).toBe(expectedCO2Savings);
    });
  });

  describe('calculateMinimumConsumption', () => {
    it('should return true for Monofasico with consumption above minimum', () => {
      const historicoDeConsumo = [400, 400, 400];
      const tipoDeConexao = TiposDeConexaoEnum.Monofasico;
      const result = eligibilityService.calculateMinimumConsumption(historicoDeConsumo, tipoDeConexao);

      expect(result).toBe(true);
    });

    it('should return false for Monofasico with consumption below minimum', () => {
      const historicoDeConsumo = [50, 80, 100];
      const tipoDeConexao = TiposDeConexaoEnum.Monofasico;
      const result = eligibilityService.calculateMinimumConsumption(historicoDeConsumo, tipoDeConexao);

      expect(result).toBe(false);
    });

    it('should return true for Bifasico with consumption above minimum', () => {
      const historicoDeConsumo = [500, 500, 500];
      const tipoDeConexao = TiposDeConexaoEnum.Bifasico;
      const result = eligibilityService.calculateMinimumConsumption(historicoDeConsumo, tipoDeConexao);

      expect(result).toBe(true);
    });

    it('should return false for Bifasico with consumption below minimum', () => {
      const historicoDeConsumo = [80, 120, 150];
      const tipoDeConexao = TiposDeConexaoEnum.Bifasico;
      const result = eligibilityService.calculateMinimumConsumption(historicoDeConsumo, tipoDeConexao);

      expect(result).toBe(false);
    });

    it('should return true for Trifasico with consumption above minimum', () => {
      const historicoDeConsumo = [750, 750, 750];
      const tipoDeConexao = TiposDeConexaoEnum.Trifasico;
      const result = eligibilityService.calculateMinimumConsumption(historicoDeConsumo, tipoDeConexao);

      expect(result).toBe(true);
    });

    it('should return false for Trifasico with consumption below minimum', () => {
      const historicoDeConsumo = [120, 180, 220];
      const tipoDeConexao = TiposDeConexaoEnum.Trifasico;
      const result = eligibilityService.calculateMinimumConsumption(historicoDeConsumo, tipoDeConexao);

      expect(result).toBe(false);
    });
  });
});

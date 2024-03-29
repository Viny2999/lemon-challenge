import { Request, Response } from 'express';
import { EligibilityRequestBody,
  TiposDeConexaoEnum,
  RazoesEnum,
  classesDeConsumoPermitidas,
  subClassesDeConsumoPermitidos,
  modalidadesTarifariasPermitidas,
  MIN_CONSUMPTION_MONOFASICO,
  MIN_CONSUMPTION_BIFASICO,
  MIN_CONSUMPTION_TRIFASICO
} from './types/eligibility.type';

export class EligibilityService {

  public checkEligibility = (req: Request, res: Response): Response => {
    const eligibilityRequestBody: EligibilityRequestBody = req.body;

    const razoesDeInelegibilidade: RazoesEnum[] = [];

    if (!classesDeConsumoPermitidas.includes(eligibilityRequestBody.classeDeConsumo)) {
      razoesDeInelegibilidade.push(RazoesEnum.ClasseConsumo);
    }

    const subClassesDeConsumoPermitidas = subClassesDeConsumoPermitidos[eligibilityRequestBody.classeDeConsumo] || [];
    if (!subClassesDeConsumoPermitidas.includes(eligibilityRequestBody.subclassesDeConsumo)) {
      razoesDeInelegibilidade.push(RazoesEnum.SubClasseConsumo);
    }

    if (!modalidadesTarifariasPermitidas.includes(eligibilityRequestBody.modalidadeTarifaria)) {
      razoesDeInelegibilidade.push(RazoesEnum.ModalidadeTarifaria);
    }

    if (!this.calculateMinimumConsumption(eligibilityRequestBody.historicoDeConsumo, eligibilityRequestBody.tipoDeConexao)) {
      razoesDeInelegibilidade.push(RazoesEnum.ConsumoMinimo);
    }

    if (razoesDeInelegibilidade.length > 0) {
      return res.send({
        elegivel: false,
        razoesDeInelegibilidade,
      });
    }

    const economiaAnualDeCO2 = this.calculateEconomyAnnualCO2((eligibilityRequestBody.historicoDeConsumo));

    return res.send({
      elegivel: true,
      economiaAnualDeCO2,
    });
  };

  public getTotalHistoricoDeConsumo = (historicoDeConsumo: number[]): number => historicoDeConsumo.reduce((acc, consumo) => acc + consumo, 0);

  public calculateMinimumConsumption = (historicoDeConsumo: number[], tipoDeConexao: TiposDeConexaoEnum) => {
    const mediaConsumo = this.getTotalHistoricoDeConsumo(historicoDeConsumo) / historicoDeConsumo.length;
  
    switch (tipoDeConexao) {
      case TiposDeConexaoEnum.Monofasico:
        return mediaConsumo >= MIN_CONSUMPTION_MONOFASICO;
      case TiposDeConexaoEnum.Bifasico:
        return mediaConsumo >= MIN_CONSUMPTION_BIFASICO;
      case TiposDeConexaoEnum.Trifasico:
        return mediaConsumo >= MIN_CONSUMPTION_TRIFASICO;
      default:
        return false;
    }
  };

  public calculateEconomyAnnualCO2 = (historicoDeConsumo: number[]) => {
    const emissaoMediaCO2PorKWh = 84;

    const mediaConsumo = this.getTotalHistoricoDeConsumo(historicoDeConsumo) / historicoDeConsumo.length;

    const totalConsumo = mediaConsumo * 12;
    
    return parseFloat((totalConsumo * (emissaoMediaCO2PorKWh / 1000)).toFixed(2));
  };
}

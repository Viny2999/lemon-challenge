export enum TiposDeConexaoEnum {
  Monofasico = 'monofasico',
  Bifasico = 'bifasico',
  Trifasico = 'trifasico',
}

export interface EligibilityRequestBody {
  numeroDoDocumento: string;
  tipoDeConexao: TiposDeConexaoEnum;
  classeDeConsumo: string;
  subclassesDeConsumo: string;
  modalidadeTarifaria: string;
  historicoDeConsumo: number[];
}

export enum RazoesEnum {
  ClasseConsumo = 'Classe de consumo não aceita',
  SubClasseConsumo = 'Subclasse de consumo não aceita',
  ModalidadeTarifaria = 'Modalidade tarifária não aceita',
  ConsumoMinimo = 'Consumo muito baixo para tipo de conexão',
}

export const classesDeConsumoPermitidas = [
  'residencial',
  'industrial',
  'comercial',
];

export const subClassesDeConsumoPermitidos = {
  comercial: [
    'administração condominal',
    'comercial',
    'serviços de telecomunicação',
  ],
  industrial: [
    'industrial',
  ],
  residencial: [
    'residencial',
  ]
};

export const modalidadesTarifariasPermitidas = ['branca', 'convencional'];

export const MIN_CONSUMPTION_MONOFASICO = 400;
export const MIN_CONSUMPTION_BIFASICO = 500;
export const MIN_CONSUMPTION_TRIFASICO = 750;

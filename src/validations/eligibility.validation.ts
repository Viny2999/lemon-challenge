import Joi, { ObjectSchema } from 'joi';
import { classesDeConsumo, modalidadesTarifarias, tiposDeConexao } from './types/eligibility.enum';

interface ValidationSchema {
  body: ObjectSchema;
}

const validateCPForCNPJ = (value: string) => {
  const cpfRegex = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/;
  const cnpjRegex = /d{2}\.?\d{3}\.?\d{3}\/?\d{4}\-?\d{2}/;
  
  if (!(cpfRegex.test(value) || cnpjRegex.test(value))) {
    throw new Error('CPF ou CNPJ Invalidos');
  }

  return value;
};

export const eligibilityBody: ValidationSchema = {
  body: Joi.object({
    numeroDoDocumento: Joi.string().required().custom(validateCPForCNPJ),
    tipoDeConexao: Joi.string().valid(...tiposDeConexao).required(),
    classeDeConsumo: Joi.string().valid(...classesDeConsumo).required(),
    modalidadeTarifaria: Joi.string().valid(...modalidadesTarifarias).required(),
    historicoDeConsumo: Joi.array()
      .min(3)
      .max(12)
      .items(Joi.number().integer().min(0).max(9999))
  }),
};

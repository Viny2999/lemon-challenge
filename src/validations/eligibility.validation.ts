import Joi, { ObjectSchema } from 'joi';
import { cpf, cnpj } from 'cpf-cnpj-validator'; 
import { classesDeConsumo, subClassesDeConsumo, modalidadesTarifarias, tiposDeConexao } from './types/eligibility.enum';

interface ValidationSchema {
  body: ObjectSchema;
}

const validateCPForCNPJ = (value: string) => {
  const cpfRegex = /^\d{11}$/;
  const cnpjRegex = /^\d{14}$/;
  
  if (!(cpfRegex.test(value) || cnpjRegex.test(value))) {
    throw new Error('CPF ou CNPJ Invalidos');
  }
  
  if (!(cpf.isValid(value) || cnpj.isValid(value))) {
    throw new Error('CPF ou CNPJ Invalidos');
  }
  return value;
};

export const eligibilityBody: ValidationSchema = {
  body: Joi.object({
    numeroDoDocumento: Joi.string().required().custom(validateCPForCNPJ),
    tipoDeConexao: Joi.string().valid(...tiposDeConexao).required(),
    classeDeConsumo: Joi.string().valid(...classesDeConsumo).required(),
    subclassesDeConsumo: Joi.string().valid(...subClassesDeConsumo).required(),
    modalidadeTarifaria: Joi.string().valid(...modalidadesTarifarias).required(),
    historicoDeConsumo: Joi.array()
      .min(3)
      .max(12)
      .items(Joi.number().integer().min(0).max(9999))
  }),
};

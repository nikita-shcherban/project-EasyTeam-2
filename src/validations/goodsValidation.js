import { celebrate, Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';

export const getGoodByIdSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.string()
      .custom((value, helpers) => {
        if (!isValidObjectId(value)) {
          return helpers.message('Invalid good ID format');
        }
        return value;
      })
      .required(),
  }),
});

import * as yup from 'yup'

export const carSchema = yup.object().shape({
  carModel: yup.string().min(3).required(),
  price: yup.number().required(),
  phoneNumber: yup.string().length(11).required(),
  maxPictures: yup.number().min(1).max(10).required(),
});

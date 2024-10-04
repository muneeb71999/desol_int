import * as yup from 'yup'

export const userSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
})

export const userLoginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required()
})

export const userRegisterSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
})

export const updateProfileSchema = yup.object().shape({
  name: yup.string(),
  email: yup.string(),
  country: yup.string(),
  phoneNumber: yup.string(),
  picture: yup.string()
})

export const updatePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required(),
  newPassword: yup.string().required()
})

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSession } from "next-auth/react";
import axios from 'axios';
import { toast } from "react-toastify";

const schema = yup.object().shape({
  carModel: yup.string().required('Car model is required'),
  price: yup.number().required().min(0, 'Price must be greater than 0').typeError('Price must be a number'),
  phoneNumber: yup.string().required('Phone number is required').matches(/^[0-9]+$/, 'Phone number must be a number').max(11, 'Phone number must be 11 digits').min(11, 'Phone number must be 11 digits').typeError('Phone number must be a number'),
  maxPictures: yup.number().required('Max Pictures is required').min(1, 'Max pcitures must be between 1 to 10').max(10, 'Max pictures must be between 1 and 10').typeError('Max pictures must be a number'),
});

export function CarForm() {
  const { data: session, status } = useSession();
  const { handleSubmit, register, formState : { errors } } = useForm<{
    carModel: string;
    price: number;
    phoneNumber: string;
    maxPictures: number;
  }>({ 
    resolver: yupResolver(schema) 
  });

  const onSubmit = (data: {
    carModel: string;
    price: number;
    phoneNumber: string;
    maxPictures: number;
  }) => {
    axios.post(process.env.NEXT_PUBLIC_API_URL + '/api/cars', data, {
      headers: {
        // @ts-ignore 
        Authorization: `Bearer ${session?.token}`
      }
    }).then((res) => {
      toast.success(res.data.message);
    }).catch((error) => {
      toast.error(error.response.data.message);
    });
  };

  return (
    <Card className="mx-auto max-w-sm min-w-[380px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Add New Car</CardTitle>
        <CardDescription>Enter details below!</CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="carModel">Car Model</Label>
              <Input id="carModel" {...register('carModel')} type="text" placeholder="Car Model" required />
              {errors.carModel && <p className="text-red-500 text-xs capitalize">{errors.carModel.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" {...register('price')} type="number" placeholder="Price" required />
              {errors.price && <p className="text-red-500 text-xs capitalize">{errors.price.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" {...register('phoneNumber')} type="text" placeholder="Phone Number" required />
              {errors.phoneNumber && <p className="text-red-500 text-xs capitalize">{errors.phoneNumber.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPictures">Max Number of Pictures</Label>
              <Input id="maxPictures" {...register('maxPictures')} type="number" placeholder="1-10" required />
              {errors.maxPictures && <p className="text-red-500 text-xs capitalize">{errors.maxPictures.message}</p>}
            </div>
            <Button type="submit" className="w-full">
              Save
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

import { createCar } from "@/services/car.service";
import { successResponse } from "@/utils/success-response";
import { carSchema } from "@/validators/car.validator";
import { Request, Response } from "express";

export async function createCarHandler(req: Request, res: Response) {

  await req.validate(carSchema);

  const userId = req.user?.id;

  console.log('userId', userId);

  const data = {
    ...req.body,
    userId,
  }

  // Create a new car
  const car = await createCar(data);

  // Send the response
  successResponse(res, car, 'Car created successfully with CarId:' + car.id);
}
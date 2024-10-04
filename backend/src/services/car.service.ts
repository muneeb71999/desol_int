import { Car } from "@/models/car.model";
import { ICar, ICarDocument } from "@/types";

export async function createCar(carData: ICar): Promise<ICarDocument> {
  return await Car.create(carData);
}
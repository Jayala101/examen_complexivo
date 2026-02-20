import { http } from "./http";
import type { Paginated } from "../types/drf";
import type { Order } from "../types/order";

export async function listOrdersApi(): Promise<Paginated<Order> | Order[]> {
  const { data } = await http.get<Paginated<Order> | Order[]>("/api/orders/");
  return data;
}

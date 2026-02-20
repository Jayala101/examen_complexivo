import { http } from "./http";
import type { OrderEvent } from "../types/orderEvent";
import type { Paginated } from "../types/drf";

export type OrderEventCreatePayload = {
  order_id: number;
  event_type: string;
  source: string;
};

export async function listOrderEventsApi(): Promise<Paginated<OrderEvent> | OrderEvent[]> {
  const { data } = await http.get<Paginated<OrderEvent> | OrderEvent[]>("/api/order_events/");
  return data;
}

export async function createOrderEventApi(payload: OrderEventCreatePayload): Promise<OrderEvent> {
  const { data } = await http.post<OrderEvent>("/api/order-events/", payload);
  return data;
}

export async function deleteOrderEventApi(id: string): Promise<void> {
  await http.delete(`/api/vehicle-services/${id}/`);
}

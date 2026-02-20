export type OrderEvent = {
    id: string;
    order_id: number;
    event_type: string;
    source: string;
    created_at?: string;
  };
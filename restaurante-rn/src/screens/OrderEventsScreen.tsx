import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { listOrdersApi } from "../api/orders.api";
import { listOrderEventsApi, createOrderEventApi, deleteOrderEventApi } from "../api/orderEvents.api";

import type { Order } from "../types/order";
import type { OrderEvent } from "../types/orderEvent";
import { toArray } from "../types/drf";

export default function OrderEventsScreen() {
  const [events, setEvents] = useState<OrderEvent[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [eventType, setEventType] = useState("CREATED");
  const [source, setSource] = useState("MOBILE");
  const [errorMessage, setErrorMessage] = useState("");

  const eventTypes = ["CREATED", "SENT_TO_KITCHEN", "SERVED", "PAID", "CANCELLED"];
  const sources = ["WEB", "MOBILE", "SYSTEM"];

  const orderById = useMemo(() => {
    const map = new Map<number, Order>();
    orders.forEach((o) => map.set(o.id, o));
    return map;
  }, [orders]);

  const loadAll = async (): Promise<void> => {
    try {
      setErrorMessage("");

      const [eventsData, ordersData] = await Promise.all([
        listOrderEventsApi(),
        listOrdersApi(),
      ]);

      const eventsList = toArray(eventsData);
      const ordersList = toArray(ordersData);

      setEvents(eventsList);
      setOrders(ordersList);

      if (selectedOrderId === null && ordersList.length) setSelectedOrderId(ordersList[0].id);
    } catch {
      setErrorMessage("No se pudo cargar info. ¿Token? ¿baseURL? ¿backend encendido?");
    }
  };

  useEffect(() => { loadAll(); }, []);

  const createEvent = async (): Promise<void> => {
    try {
      setErrorMessage("");

      if (selectedOrderId === null) return setErrorMessage("Seleccione una orden");

      const created = await createOrderEventApi({
        order_id: selectedOrderId,
        event_type: eventType,
        source: source,
      });

      setEvents((prev) => [created, ...prev]);
    } catch {
      setErrorMessage("No se pudo crear evento de orden");
    }
  };

  const removeEvent = async (id: string): Promise<void> => {
    try {
      setErrorMessage("");
      await deleteOrderEventApi(id);
      setEvents((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setErrorMessage("No se pudo eliminar evento");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eventos de Ordenes (Mongo)</Text>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Text style={styles.label}>Seleccionar Orden</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedOrderId ?? ""}
          onValueChange={(value) => setSelectedOrderId(Number(value))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          {orders.map((o) => (
            <Picker.Item key={o.id} label={`Orden #${o.id} - ${o.tables_name}`} value={o.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Tipo de Evento</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={eventType}
          onValueChange={(value) => setEventType(String(value))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          {eventTypes.map((et) => (
            <Picker.Item key={et} label={et} value={et} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Origen</Text>
      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={source}
          onValueChange={(value) => setSource(String(value))}
          dropdownIconColor="#58a6ff"
          style={styles.picker}
        >
          {sources.map((s) => (
            <Picker.Item key={s} label={s} value={s} />
          ))}
        </Picker>
      </View>

      <Pressable onPress={createEvent} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Crear Evento</Text>
      </Pressable>

      <Pressable onPress={loadAll} style={[styles.btn, { marginBottom: 12 }]}>
        <Text style={styles.btnText}>Refrescar</Text>
      </Pressable>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const o = orderById.get(item.order_id);
          const line1 = o ? `Orden #${o.id} (${o.tables_name})` : `Order ID: ${item.order_id}`;

          return (
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.rowText} numberOfLines={1}>{item.event_type}</Text>
                <Text style={styles.rowSub} numberOfLines={1}>{line1}</Text>
                <Text style={styles.rowSub} numberOfLines={1}>Origen: {item.source}</Text>
                {!!item.created_at && <Text style={styles.rowSub} numberOfLines={1}>Fecha: {item.created_at}</Text>}
              </View>

              <Pressable onPress={() => removeEvent(item.id)}>
                <Text style={styles.del}>Eliminar</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  title: { color: "#58a6ff", fontSize: 22, fontWeight: "800", marginBottom: 10 },
  error: { color: "#ff7b72", marginBottom: 10 },
  label: { color: "#8b949e", marginBottom: 6, marginTop: 6 },

  pickerWrap: {
    backgroundColor: "#161b22",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#30363d",
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: { color: "#c9d1d9" },

  input: {
    backgroundColor: "#161b22",
    color: "#c9d1d9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#30363d",
  },

  btn: { backgroundColor: "#21262d", borderColor: "#58a6ff", borderWidth: 1, padding: 12, borderRadius: 8 },
  btnText: { color: "#58a6ff", textAlign: "center", fontWeight: "700" },

  row: {
    backgroundColor: "#161b22",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#30363d",
  },
  rowText: { color: "#c9d1d9", fontWeight: "800" },
  rowSub: { color: "#8b949e", marginTop: 2 },
  del: { color: "#ff7b72", fontWeight: "800" },
});

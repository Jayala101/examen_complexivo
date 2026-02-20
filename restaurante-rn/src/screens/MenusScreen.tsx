import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";

import { listMenusApi, createMenuApi, deleteMenuApi } from "../api/menus.api";
import type { Menu } from "../types/menu";
import { toArray } from "../types/drf";

function normalizeText(input: string): string {
  return input.trim();
}

export default function MenusScreen() {
  const [items, setItems] = useState<Menu[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const load = async (): Promise<void> => {
    try {
      setErrorMessage("");
      const data = await listMenusApi();
      setItems(toArray(data));
    } catch {
      setErrorMessage("No se pudo cargar Menús. ¿Login? ¿Token?");
    }
  };

  useEffect(() => { load(); }, []);

  const createItem = async (): Promise<void> => {
    try {
      setErrorMessage("");

      const cleanName = normalizeText(name);
      if (!cleanName) return setErrorMessage("Nombre es requerido");

      const parsedPrice = price.trim() ? parseFloat(price) : undefined;

      const created = await createMenuApi({
        name: cleanName,
        category: normalizeText(category) || undefined,
        price: parsedPrice,
      });

      setItems((prev) => [created, ...prev]);
      setName("");
      setCategory("");
      setPrice("");
    } catch {
      setErrorMessage("No se pudo crear ítem de menú.");
    }
  };

  const removeItem = async (id: string): Promise<void> => {
    try {
      setErrorMessage("");
      await deleteMenuApi(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch {
      setErrorMessage("No se pudo eliminar ítem.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Menú</Text>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      <Text style={styles.label}>Nombre del plato</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Ej: Pizza Margarita"
        placeholderTextColor="#8b949e"
        style={styles.input}
      />

      <Text style={styles.label}>Categoría</Text>
      <TextInput
        value={category}
        onChangeText={setCategory}
        placeholder="Ej: Comida Italiana"
        placeholderTextColor="#8b949e"
        style={styles.input}
      />

      <Text style={styles.label}>Precio</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="12.50"
        placeholderTextColor="#8b949e"
        keyboardType="numeric"
        style={styles.input}
      />

      <Pressable onPress={createItem} style={styles.btn}>
        <Text style={styles.btnText}>Crear Plato</Text>
      </Pressable>

      <Pressable onPress={load} style={[styles.btn, { marginBottom: 12, marginTop: 10 }]}>
        <Text style={styles.btnText}>Refrescar</Text>
      </Pressable>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.rowText} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.rowSub} numberOfLines={1}>
                {item.category || "Sin categoría"} - ${item.price ?? "0"}
              </Text>
            </View>

            <Pressable onPress={() => removeItem(item.id)}>
              <Text style={styles.del}>Eliminar</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  title: { color: "#58a6ff", fontSize: 22, fontWeight: "800", marginBottom: 10 },
  error: { color: "#ff7b72", marginBottom: 10 },
  label: { color: "#8b949e", marginBottom: 6, marginTop: 6 },
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
  del: { color: "#ff7b72", fontWeight: "700" },
});

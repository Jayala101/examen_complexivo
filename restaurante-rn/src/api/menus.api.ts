import { http } from "./http";
import type { Menu } from "../types/menu";
import type { Paginated } from "../types/drf";

export async function listMenusApi(): Promise<Paginated<Menu> | Menu[]> {
  const { data } = await http.get<Paginated<Menu> | Menu[]>("/api/menus/");
  return data;
}

export async function createMenuApi(payload: Pick<Menu, "name"> & Partial<Menu>): Promise<Menu> {
  const { data } = await http.post<Menu>("/api/menus/", payload);
  return data;
}

export async function deleteMenuApi(id: string): Promise<void> {
  await http.delete(`/api/service-types/${id}/`);
}

import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert, Checkbox, FormControlLabel
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Table as TableType, listTablesApi, createTableApi, updateTableApi, deleteTableApi } from "../api/tables.api";

export default function AdminTablesPage() {
  const [items, setItems] = useState<TableType[]>([]);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(4);
  const [isAvailable, setIsAvailable] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listTablesApi();
      setItems(data.results);
    } catch {
      setError("No se pudo cargar mesas. ¿Login? ¿Token admin?");
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!name.trim()) return setError("Nombre requerido");

      const payload = {
        name: name.trim(),
        capacity: Number(capacity),
        is_available: isAvailable,
      };

      if (editId) await updateTableApi(editId, payload);
      else await createTableApi(payload);

      setName("");
      setCapacity(4);
      setIsAvailable(true);
      setEditId(null);
      await load();
    } catch {
      setError("No se pudo guardar mesa. ¿Token admin?");
    }
  };

  const startEdit = (m: TableType) => {
    setEditId(m.id);
    setName(m.name);
    setCapacity(m.capacity);
    setIsAvailable(m.is_available);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteTableApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar mesa. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Mesas (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField label="Nombre mesa" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            <TextField label="Capacidad" type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} sx={{ width: 120 }} />
            <FormControlLabel
              control={<Checkbox checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />}
              label="Disponible"
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setName(""); setCapacity(4); setIsAvailable(true); setEditId(null); }}>Limpiar</Button>
            <Button variant="outlined" onClick={load}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Capacidad</TableCell>
              <TableCell>Disponible</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.id}</TableCell>
                <TableCell>{m.name}</TableCell>
                <TableCell>{m.capacity}</TableCell>
                <TableCell>{m.is_available ? "Sí" : "No"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(m)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(m.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

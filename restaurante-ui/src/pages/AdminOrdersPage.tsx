import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Table as TableType, listTablesApi } from "../api/tables.api";
import { type Order, listOrdersAdminApi, createOrderApi, updateOrderApi, deleteOrderApi } from "../api/orders.api";

export default function AdminOrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [tables, setTables] = useState<TableType[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [table, setTable] = useState<number>(0);
  const [itemsSummary, setItemsSummary] = useState("");
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("PENDING");

  const load = async () => {
    try {
      setError("");
      const data = await listOrdersAdminApi();
      setItems(data.results);
    } catch {
      setError("No se pudo cargar pedidos. ¿Login? ¿Token admin?");
    }
  };

  const loadTables = async () => {
    try {
      const data = await listTablesApi();
      setTables(data.results);
      if (!table && data.results.length > 0) setTable(data.results[0].id);
    } catch {
      //
    }
  };

  useEffect(() => { load(); loadTables(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!table) return setError("Seleccione una mesa");
      if (!itemsSummary.trim()) return setError("Resumen de items es requerido");

      const payload = {
        table: Number(table),
        items_summary: itemsSummary.trim(),
        total: Number(total),
        status: status,
      };

      if (editId) await updateOrderApi(editId, payload);
      else await createOrderApi(payload);

      setEditId(null);
      setItemsSummary("");
      setTotal(0);
      setStatus("PENDING");
      await load();
    } catch {
      setError("No se pudo guardar pedido. ¿Token admin?");
    }
  };

  const startEdit = (o: Order) => {
    setEditId(o.id);
    setTable(o.table);
    setItemsSummary(o.items_summary);
    setTotal(o.total);
    setStatus(o.status);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteOrderApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar pedido. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Pedidos (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControl sx={{ width: 260 }}>
              <InputLabel id="table-label">Mesa</InputLabel>
              <Select
                labelId="table-label"
                label="Mesa"
                value={table}
                onChange={(e) => setTable(Number(e.target.value))}
              >
                {tables.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name} (Cap: {t.capacity})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="Items" value={itemsSummary} onChange={(e) => setItemsSummary(e.target.value)} fullWidth />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label="Total" type="number" value={total} onChange={(e) => setTotal(Number(e.target.value))} sx={{ width: 160 }} />
            
            <FormControl sx={{ width: 220 }}>
              <InputLabel id="status-label">Estado</InputLabel>
              <Select
                labelId="status-label"
                label="Estado"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="PENDING">PENDING</MenuItem>
                <MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
                <MenuItem value="SERVED">SERVED</MenuItem>
                <MenuItem value="PAID">PAID</MenuItem>
              </Select>
            </FormControl>

            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setEditId(null); setItemsSummary(""); setTotal(0); setStatus("PENDING"); }}>Limpiar</Button>
            <Button variant="outlined" onClick={() => { load(); loadTables(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Mesa</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((o) => (
              <TableRow key={o.id}>
                <TableCell>{o.id}</TableCell>
                <TableCell>{o.tables_name}</TableCell>
                <TableCell>{o.items_summary}</TableCell>
                <TableCell>${o.total}</TableCell>
                <TableCell>{o.status}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(o)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(o.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}

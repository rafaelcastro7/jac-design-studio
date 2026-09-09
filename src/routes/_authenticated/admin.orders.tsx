import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, Empty, Pill, btnGhost, cadExact, dateShort, inputCls } from "@/components/admin/kit";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: OrdersAdmin,
});

const STATUS = ["nuevo", "confirmado", "produccion", "enviado", "entregado", "cancelado"] as const;
type Status = (typeof STATUS)[number];

const STATUS_LABEL: Record<Status, string> = {
  nuevo: "Nuevo",
  confirmado: "Confirmado",
  produccion: "En producción",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

interface Item {
  id: string;
  name: string;
  qty: number;
  unit_price_cad: number;
  product_slug: string | null;
}
interface Order {
  id: string;
  code: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  notes: string | null;
  lang: string;
  total_cad: number;
  status: Status;
  created_at: string;
  order_items: Item[];
}

function OrdersAdmin() {
  const { isAdmin } = useAuth();
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"todos" | Status>("todos");
  const [open, setOpen] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Order[];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
    onError: (e: Error) => setError(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
    onError: (e: Error) => setError(e.message),
  });

  const list = (data ?? []).filter((o) => filter === "todos" || o.status === filter);

  return (
    <Card
      title="Pedidos y clientes"
      action={
        <select value={filter} onChange={(e) => setFilter(e.target.value as Status | "todos")} className={`${inputCls} max-w-[15rem]`}>
          <option value="todos">Todos los estados</option>
          {STATUS.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      }
    >
      {error && <p className="mb-3 text-xs font-semibold text-rose-600">{error}</p>}
      {isLoading ? (
        <Empty>Cargando pedidos…</Empty>
      ) : list.length === 0 ? (
        <Empty>Aún no hay pedidos. Los pagos de la tienda aparecerán aquí automáticamente.</Empty>
      ) : (
        <ul className="grid gap-2">
          {list.map((o) => (
            <li key={o.id} className="rounded-2xl border border-border p-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs font-bold">{o.code}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{o.customer_name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {o.customer_email}
                    {o.customer_phone ? ` · ${o.customer_phone}` : ""} · {dateShort(o.created_at)} · {o.lang.toUpperCase()}
                  </p>
                </div>
                <span className="text-sm font-bold">{cadExact(Number(o.total_cad))}</span>
                <select
                  value={o.status}
                  onChange={(e) => setStatus.mutate({ id: o.id, status: e.target.value as Status })}
                  className="rounded-2xl border border-input bg-background px-3 py-2 text-xs font-semibold"
                >
                  {STATUS.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
                <button onClick={() => setOpen(open === o.id ? null : o.id)} className={btnGhost}>
                  {open === o.id ? "Ocultar" : "Detalle"}
                </button>
                {isAdmin && (
                  <button
                    onClick={() => {
                      if (confirm(`¿Borrar el pedido ${o.code}?`)) remove.mutate(o.id);
                    }}
                    className="rounded-2xl border border-border px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-muted"
                  >
                    Borrar
                  </button>
                )}
              </div>

              {open === o.id && (
                <div className="mt-3 grid gap-2 border-t border-border pt-3">
                  {o.order_items.map((it) => (
                    <div key={it.id} className="flex items-center gap-3 text-sm">
                      <Pill>{it.qty}×</Pill>
                      <span className="min-w-0 flex-1 truncate">{it.name}</span>
                      <span className="font-semibold">{cadExact(Number(it.unit_price_cad) * it.qty)}</span>
                    </div>
                  ))}
                  {o.notes && <p className="text-xs text-muted-foreground">Notas: {o.notes}</p>}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

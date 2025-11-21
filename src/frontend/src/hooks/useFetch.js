import { useState } from 'react';

function useFetch() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const callFetch = async ({
    uri,
    method = 'GET',
    body,
    headers,
    signal,
    toJson = true,
    toBlob = false,
    parse = true,
    removeContentType = false,
  }) => {
    setResult(null);
    setError(null);
    setLoading(true);
    try {
      const heads = { 'Content-Type': 'application/json', ...headers };
      if (removeContentType) delete heads['Content-Type'];

      const reply = await fetch(uri, {
        method,
        headers: heads,
        body: body != null ? JSON.stringify(body) : null,
        signal,
      });

      // Si el caller quiere el Response crudo
      if (!parse) {
        if (!reply.ok) {
          // aun así devolvemos un error legible
          let msg = 'Ocurrió un error.';
          try {
            const ct = reply.headers.get('content-type') || '';
            if (ct.includes('application/json')) {
              const j = await reply.clone().json();
              msg = j?.detail?.toString()?.trim()
                 || j?.err?.toString()?.trim()
                 || j?.message?.toString()?.trim()
                 || JSON.stringify(j);
            } else {
              msg = (await reply.clone().text())?.trim() || msg;
            }
          } catch {}
          setError({ status: reply.status, message: msg });
          return;
        }
        setResult(reply);
        return;
      }

      // --- Manejo de error HTTP primero ---
      if (!reply.ok) {
        console.log('Error HTTP recibido:', reply);
        let msg = 'Ocurrió un error.';
        try {
          const ct = reply.headers.get('content-type') || '';
          if (ct.includes('application/json')) {
            const j = await reply.json();              // ← ahora sí, primera y única lectura
            console.log('Error JSON recibido:', j);
            msg = j?.detail?.toString()?.trim()
              || j?.err?.toString()?.trim()
              || j?.message?.toString()?.trim()
              || JSON.stringify(j);
          } else {
            msg = (await reply.text())?.trim() || msg; // texto / html
          }
        } catch {}
        setError({ status: reply.status, message: msg });
        return;
      }

      // --- Éxito: parse según flags ---
      let res;
      if (toBlob) res = await reply.blob();
      else if (toJson) res = await reply.json();
      else res = await reply.text();

      setResult(res ?? true);
    } catch (ex) {
      const isAbort = ex?.name === 'AbortError';
      setError({ status: undefined, message: isAbort ? 'La solicitud fue cancelada.' : (ex?.message || 'Error de red.') });
    } finally {
      setLoading(false);
    }
  };

  return { callFetch, result, error, loading };
}

export default useFetch;

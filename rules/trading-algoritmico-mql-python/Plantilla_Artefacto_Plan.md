# Plantilla de plan por artefacto (`*_Plan.md`)

## Metadatos
- Fecha: `<YYYY-MM-DD>`
- Archivo objetivo: `<ruta_relativa/Archivo.ext>`
- Tipo: `<Indicador MQL5 | EA MQL5 | Script MQL5 | Script Python trading>`
- Estado: `<vigente | en revision | cerrado>`
- Dependencias directas: `<indicadores, includes, modulos, archivos>`

## Objetivo
`<Que problema resuelve este archivo y que resultado operativo debe entregar>`

## Alcance
- `<Funcion 1>`
- `<Funcion 2>`
- `<Funcion 3>`
- No alcance:
  - `<Lo que este archivo NO debe hacer>`

## Contrato tecnico
- Entradas (`input` / parametros):
  - `<Parametro> -> <unidad> -> <rango>`
- Salidas:
  - `<Si aplica: valores, objetos, logs, archivos>`
- Buffers (si es indicador):
  - `idx <N> -> <nombre semantico> -> <unidad> -> <historico/vela0/ambos> -> <vacio: EMPTY_VALUE/0>`
- Integracion EA (si aplica):
  - `<iCustom/CopyBuffer indices>`

## Pasos de implementacion
1. `<Paso 1>`
2. `<Paso 2>`
3. `<Paso 3>`
4. `<Paso 4>`

## Criterios de verificacion
- Compila sin errores.
- `<Criterio funcional 1>`
- `<Criterio funcional 2>`
- `<Criterio de rendimiento/estabilidad>`
- `<Criterio de integracion con otros artefactos>`

## Riesgos y mitigacion
- `<Riesgo 1> -> <Mitigacion>`
- `<Riesgo 2> -> <Mitigacion>`

## Historial de cambios del plan
| Fecha | Cambio | Motivo |
|---|---|---|
| `<YYYY-MM-DD>` | `<Descripcion>` | `<Motivo>` |


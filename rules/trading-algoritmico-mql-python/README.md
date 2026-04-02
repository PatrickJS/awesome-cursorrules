# Trading Algorithmic MQL/Python .cursorrules prompt file

Author: warcklian

## What you can build

- MQL5 indicators with split historical/intrabar logic and stable `CopyBuffer` contracts for EA consumption.
- MQL5 Expert Advisors with robust execution flow, risk controls, and integration of multiple indicators through `iCustom`.
- Hybrid MQL5 + Python pipelines for data extraction, feature generation, validation, and signal research.
- Tick-aware intrabar analytics modules (`Bid/Ask/MqlTick`) with performance-safe persistence (event snapshots instead of unbounded tick logging).
- Reusable trading project scaffolds with per-artifact plans (`*_Plan.md`) for indicators, EAs, scripts, and Python tools.

## Benefits

- Consistent architecture across trading projects (indicator = signal, EA = execution, Python = analytics/support).
- Lower integration risk through explicit buffer contracts and plan-first change discipline.
- Better maintainability and onboarding via master plan + per-file plans.
- Faster debugging and regression control in high-frequency and intrabar scenarios.
- Compatibility with Cursor global rules without conflicts.

## Synopsis

This prompt package defines a practical standard for algorithmic trading projects using MQL4/MQL5 and Python. It enforces plan persistence, per-file design documentation, strict indicator/EA separation, and clear historical vs real-time semantics. The result is a repeatable development workflow optimized for low-lag signal engineering and safe execution logic.

## Overview of .cursorrules prompt

The `.cursorrules` file in this pack guides an AI assistant to work in a trading-specific way:

- Follow MetaTrader architecture and MQL5 constraints (handles, `CopyBuffer`, `OnInit/OnDeinit` lifecycle).
- Keep trading execution in EAs and avoid order logic inside indicators.
- Require per-artifact plans (`*_Plan.md`) and synchronize plans before implementation changes.
- Define and preserve indicator buffer contracts for EA integration.
- Distinguish intrabar real-time data (`Bid/Ask/ticks`) from closed-bar historical calculations.
- Apply performance-aware persistence strategies for tick data.

## Contents

- `.cursorrules`: reusable trading rules for MQL4/MQL5/Python.
- `Plantilla_Artefacto_Plan.md`: template for artifact-level plans (`*_Plan.md`).

## Quick start in a new project

1. Copy `.cursorrules` to repository root.
2. Copy `Plantilla_Artefacto_Plan.md` to repository root.
3. Create master plan for the active workstream:
   - `Plan.md` or `<Component>_Plan.md`.
4. For each created/modified trading artifact, create:
   - `Indicators/<FileName>_Plan.md`
   - `Experts/<FileName>_Plan.md`
   - `Scripts/<FileName>_Plan.md`
   - `<python_path>/<FileName>_Plan.md`

## Compatibility note

These rules are designed to complement Cursor global rules, not replace or block them.

---

# Version en Espanol

## Autor

warcklian

## Que puedes construir

- Indicadores MQL5 con logica separada entre historico e intrabarra, y contratos de buffers estables para consumo por EAs.
- Expert Advisors MQL5 con flujo de ejecucion robusto, control de riesgo e integracion de multiples indicadores via `iCustom`.
- Pipelines hibridos MQL5 + Python para extraccion de datos, generacion de features y validacion de senales.
- Modulos intrabarra orientados a ticks (`Bid/Ask/MqlTick`) con persistencia eficiente (snapshots por evento en lugar de log infinito por tick).
- Plantillas reutilizables para proyectos de trading con planes por artefacto (`*_Plan.md`).

## Beneficios

- Arquitectura consistente en proyectos de trading (indicador = senal, EA = ejecucion, Python = analitica/soporte).
- Menor riesgo de integracion gracias a contratos de buffers explicitos y disciplina plan-primero.
- Mejor mantenibilidad y onboarding mediante plan maestro + planes por archivo.
- Depuracion y control de regresion mas claros en escenarios intrabarra y alta frecuencia.
- Compatibilidad con reglas globales de Cursor sin conflicto.

## Sinopsis

Este paquete define un estandar practico para proyectos de trading algoritmico con MQL4/MQL5 y Python. Refuerza persistencia de planes, documentacion por archivo, separacion indicador/EA y semantica clara entre historico y tiempo real, optimizando el desarrollo de senales de baja latencia y logica de ejecucion segura.

## Resumen del prompt `.cursorrules`

El archivo `.cursorrules` de este pack guia al asistente para:

- Respetar arquitectura y restricciones de MetaTrader/MQL5 (handles, `CopyBuffer`, ciclo `OnInit/OnDeinit`).
- Mantener la ejecucion de ordenes en EAs y evitar trading dentro de indicadores.
- Exigir planes por artefacto (`*_Plan.md`) y sincronizacion de plan antes de cambios tecnicos.
- Definir y preservar contratos de buffers para integracion con EAs.
- Diferenciar datos intrabarra (`Bid/Ask/ticks`) de calculos historicos por velas cerradas.
- Aplicar persistencia de ticks con enfoque de rendimiento.

## Contenido

- `.cursorrules`: reglas reutilizables para trading MQL4/MQL5/Python.
- `Plantilla_Artefacto_Plan.md`: plantilla para planes por artefacto (`*_Plan.md`).

## Uso rapido en un proyecto nuevo

1. Copiar `.cursorrules` en la raiz del repositorio.
2. Copiar `Plantilla_Artefacto_Plan.md` en la raiz.
3. Crear el plan maestro del frente activo:
   - `Plan.md` o `<Componente>_Plan.md`.
4. Para cada archivo de trading creado/modificado, crear:
   - `Indicators/<NombreArchivo>_Plan.md`
   - `Experts/<NombreArchivo>_Plan.md`
   - `Scripts/<NombreArchivo>_Plan.md`
   - `<ruta_python>/<NombreArchivo>_Plan.md`

## Nota de compatibilidad

Estas reglas estan diseñadas para complementar reglas globales de Cursor, no para sustituirlas ni bloquearlas.


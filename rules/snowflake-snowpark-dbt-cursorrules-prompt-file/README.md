# Snowflake Snowpark Python & dbt Cursor Rules

Rules for building data pipelines with Snowpark Python (server-side DataFrames, UDFs, stored procedures) and dbt with the Snowflake adapter (dynamic tables, incremental models, Snowflake-specific configs).

## Usage

Copy the `.cursorrules` file to the root of your Snowpark or dbt-snowflake project.

## Rules Summary

- Snowpark Python: Session, DataFrame API, scalar and vectorized UDFs, UDTFs, stored procedures
- pandas on Snowflake (modin), third-party packages, file access in UDFs
- dbt-snowflake: profiles.yml, all materializations including dynamic_table
- Incremental models with merge strategy and schema evolution
- Snowflake-specific dbt configs (cluster_by, transient, query_tag, copy_grants)
- Sources, testing, macros, and key dbt commands

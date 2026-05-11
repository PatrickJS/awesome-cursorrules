# PySpark ETL Best Practices

Production-tested PySpark & ETL best practices — code style, joins, window functions, map operations, cumulative table patterns, and Iceberg write patterns.

## Usage

Copy the `.cursorrules` file to the root of your PySpark project.

## Rules Summary

- ETL class scaffold, config factory pattern, pipeline composition with `.transform()`
- `F.col()` prefix convention, named conditions, `select` over `withColumn`
- Explicit `how=` on joins, `.alias()` for disambiguation, `F.broadcast()` for small dims
- Window functions with explicit frames, `ignorenulls=True`, `row_number` vs `first`
- `map_zip_with` for conflict-aware map merges, avoid UDFs
- Idempotent and order-independent cumulative table merges
- Data quality guardrails (`.otherwise()` pitfalls, `F.lit(None)`, intentional `persist()`)
- Iceberg write patterns (`.byName()`, `__partitions` metadata, `write.distribution-mode`)

## Credits

Inspired by the [Palantir PySpark Style Guide](https://github.com/palantir/pyspark-style-guide) and production experience debugging data skew, cumulative table merges, and Iceberg write patterns.

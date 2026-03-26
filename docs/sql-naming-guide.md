## SQL Naming Style — Concise Reference

Purpose: Clear, consistent names that improve readability, reduce errors and simplify tooling.

Core rules
* Be consistent across the entire schema.
* Use lowercase; prefer snake_case for multi-word names.
* Choose plural for tables and stick with it.
* Use descriptive, meaningful names; avoid abbreviations unless standard.
* Avoid reserved words, spaces, special characters and mixed casing.

Tables
* Use nouns that represent the entity.
* Recommended: plural, lowercase, snake_case (e.g., carts, cart_items, products).
* Association/join tables: descriptive or alphabetical combination, e.g., cart_items, carts_products, user_role.

Columns
* Lowercase snake_case.
* Primary key: id (use <table>_id only when needed for clarity or composite keys).
* Foreign keys: <referenced_table>_id (e.g., cart_id, product_id).
* Booleans: is_active, has_paid.
* Timestamps: created_at, updated_at, deleted_at.
* Units in name when relevant: weight_kg, price_usd.
* Avoid repeating table name inside the same table (use id, not cart_id in carts).

Indexes, keys and constraints
* Primary key: pk_<table> (pk_orders)
* Foreign key: fk_<table>_<referenced_table> (fk_order_items_orders)
* Unique constraint: uq_<table>_<column(s)> (uq_users_email)
* Index: ix_<table>_<column> (ix_orders_created_at)

Views, functions, procedures
* Views: vw_<description> or descriptive noun phrase (vw_active_users or active_users)
* Functions/procedures: verbs, snake_case (calculate_tax, send_order_confirmation)

Style tips
* Keep names concise but unambiguous.
* Prefer full words over cryptic abbreviations.
* Avoid encoding type in the name (don’t suffix with _str or _int).
* If a reserved word is unavoidable, rename (e.g., customers instead of users) or consistently quote (discouraged).
* Document the chosen style in project README and enforce with linters or schema tools.

Minimal recommended scheme (quick-start)
* Tables: plural, lowercase, snake_case (carts, cart_items, products)
* Columns: lowercase, snake_case (id, cart_id, product_id, quantity, created_at)
* PK: id
* FK: <table>_id
* Timestamps: created_at, updated_at
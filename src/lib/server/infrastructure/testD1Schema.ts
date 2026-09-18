import schemaSql from '../../../../schema.sql?raw';

// D1 `exec()` needs complete statements; strip `schema.sql`'s `--` comments and split on `;` so each is valid — the DDL is still the deployed file verbatim.
const toStatements = (sql: string): string[] =>
  sql
    .split('\n')
    .map((line) => line.replace(/--.*$/, ''))
    .join('\n')
    .split(';')
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0);

// Workers tests apply this deployed `schema.sql` itself, so the tested DDL cannot drift from production.
export const applyDeployedSchema = async (db: D1Database): Promise<void> => {
  await db.batch(toStatements(schemaSql).map((statement) => db.prepare(statement)));
};

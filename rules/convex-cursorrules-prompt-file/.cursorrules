This document serves as some special instructions when working with Convex.

# Schemas

When designing the schema please see this page on built in System fields and data types available: https://docs.convex.dev/database/types

Here are some specifics that are often mishandled:

## v (https://docs.convex.dev/api/modules/values#v)

The validator builder.

This builder allows you to build validators for Convex values.

Validators can be used in schema definitions and as input validators for Convex functions.

Type declaration
Name	Type
id	<TableName>(tableName: TableName) => VId<GenericId<TableName>, "required">
null	() => VNull<null, "required">
number	() => VFloat64<number, "required">
float64	() => VFloat64<number, "required">
bigint	() => VInt64<bigint, "required">
int64	() => VInt64<bigint, "required">
boolean	() => VBoolean<boolean, "required">
string	() => VString<string, "required">
bytes	() => VBytes<ArrayBuffer, "required">
literal	<T>(literal: T) => VLiteral<T, "required">
array	<T>(element: T) => VArray<T["type"][], T, "required">
object	<T>(fields: T) => VObject<Expand<{ [Property in string | number | symbol]?: Exclude<Infer<T[Property]>, undefined> } & { [Property in string | number | symbol]: Infer<T[Property]> }>, T, "required", { [Property in string | number | symbol]: Property | `${Property & string}.${T[Property]["fieldPaths"]}` }[keyof T] & string>
record	<Key, Value>(keys: Key, values: Value) => VRecord<Record<Infer<Key>, Value["type"]>, Key, Value, "required", string>
union	<T>(...members: T) => VUnion<T[number]["type"], T, "required", T[number]["fieldPaths"]>
any	() => VAny<any, "required", string>
optional	<T>(value: T) => VOptional<T>

## System fields (https://docs.convex.dev/database/types#system-fields)
Every document in Convex has two automatically-generated system fields:

_id: The document ID of the document.
_creationTime: The time this document was created, in milliseconds since the Unix epoch.

You do not need to add indices as these are added automatically.

## Example Schema

This is an example of a well crafted schema.

```ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    users: defineTable({
      name: v.string(),
    }),
    
    sessions: defineTable({
      userId: v.id("users"),
      sessionId: v.string(),
    }).index("sessionId", ["sessionId"]),
    
    threads: defineTable({
      uuid: v.string(),
      summary: v.optional(v.string()),
      summarizer: v.optional(v.id("_scheduled_functions")),
    }).index("uuid", ["uuid"]),

    messages: defineTable({
      message: v.string(),
      threadId: v.id("threads"),
      author: v.union(
        v.object({
          role: v.literal("system"),
        }),
        v.object({
          role: v.literal("assistant"),
          context: v.array(v.id("messages")),
          model: v.optional(v.string()),
        }),
        v.object({
          role: v.literal("user"),
          userId: v.id("users"),
        }),
      ),
    })
      .index("threadId", ["threadId"]),
  },
);
```

# Typescript

Type annotating client-side code
When you want to pass the result of calling a function around your client codebase, you can use the generated types Doc and Id, just like on the backend:

```tsx
import { Doc, Id } from "../convex/_generated/dataModel";

function Channel(props: { channelId: Id<"channels"> }) {
  // ...
}

function MessagesView(props: { message: Doc<"messages"> }) {
  // ...
}
```

You can also declare custom types inside your backend codebase which include Docs and Ids, and import them in your client-side code.

You can also use WithoutSystemFields and any types inferred from validators via Infer.

# Best Practices (https://docs.convex.dev/production/best-practices/)

## Database
### Use indexes or paginate all large database queries.
Database indexes with range expressions allow you to write efficient database queries that only scan a small number of documents in the table. Pagination allows you to quickly display incremental lists of results. If your table could contain more than a few thousand documents, you should consider pagination or an index with a range expression to ensure that your queries stay fast.

For more details, check out our Introduction to Indexes and Query Performance article.

### Use tables to separate logical object types.
Even though Convex does support nested documents, it is often better to put separate objects into separate tables and use Ids to create references between them. This will give you more flexibility when loading and querying documents.

You can read more about this at Document IDs.

## Use helper functions to write shared code.
Write helper functions in your convex/ directory and use them within your Convex functions. Helpers can be a powerful way to share business logic, authorization code, and more.

Helper functions allow sharing code while still executing the entire query or mutation in a single transaction. For actions, sharing code via helper functions instead of using ctx.runAction reduces function calls and resource usage.

## Prefer queries and mutations over actions
You should generally avoid using actions when the same goal can be achieved using queries or mutations. Since actions can have side effects, they can't be automatically retried nor their results cached. Actions should be used in more limited scenarios, such as calling third-party services.

## The Zen of Convex (https://docs.convex.dev/zen)

### Performance
Double down on the sync engine
There's a reason why a deterministic, reactive database is the beating heart of Convex: the more you center your apps around its properties, the better your projects will fare over time. Your projects will be easier to understand and refactor. Your app's performance will stay screaming fast. You won't have any consistency or state management problems.

Use a query for nearly every app read
Queries are the reactive, automatically cacheable, consistent and resilient way to propagate data to your application and its jobs. With very few exceptions, every read operation in your app should happen via a query function.

Keep sync engine functions light & fast
In general, your mutations and queries should be working with less than a few hundred records and should aim to finish in less than 100ms. It's nearly impossible to maintain a snappy, responsive app if your synchronous transactions involve a lot more work than this.

Use actions sparingly and incrementally
Actions are wonderful for batch jobs and/or integrating with outside services. They're very powerful, but they're slower, more expensive, and Convex provides a lot fewer guarantees about their behavior. So never use an action if a query or mutation will get the job done.

Don't over-complicate client-side state management
Convex builds in a ton of its own caching and consistency controls into the app's client library. Rather than reinvent the wheel, let your client-side code take advantage of these built-in performance boosts.

Let Convex handle caching & consistency
Be thoughtful about the return values of mutations

### Architecture
Create server-side frameworks using "just code"
Convex's built-in primitives are pretty low level! They're just functions. What about authentication frameworks? What about object-relational mappings? Do you need to wait until Convex ships some in-built feature to get those? Nope. In general, you should solve composition and encapsulation problems in your server-side Convex code using the same methods you use for the rest of your TypeScript code bases. After all, this is why Convex is "just code!" Stack always has great examples of ways to tackle these needs.


Don't misuse actions
Actions are powerful, but it's important to be intentional in how they fit into your app's data flow.

Don't invoke actions directly from your app
In general, it's an anti-pattern to call actions from the browser. Usually, actions are running on some dependent record that should be living in a Convex table. So it's best trigger actions by invoking a mutation that both writes that dependent record and schedules the subsequent action to run in the background.

Don't think 'background jobs', think 'workflow'
When actions are involved, it's useful to write chains of effects and mutations, such as:

action code → mutation → more action code → mutation.

Then apps or other jobs can follow along with queries.

Record progress one step at a time
While actions could work with thousands of records and call dozens of APIs, it's normally best to do smaller batches of work and/or to perform individual transformations with outside services. Then record your progress with a mutation, of course. Using this pattern makes it easy to debug issues, resume partial jobs, and report incremental progress in your app's UI.
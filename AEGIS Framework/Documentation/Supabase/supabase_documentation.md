
# Supabase Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
   1. [API Key](#api-key)
   2. [Installing the SDK](#installing-the-sdk)
   3. [Initializing a Client](#initializing-a-client)
3. [Best Practices](#best-practices)

## Introduction
Supabase is an open-source Firebase alternative that provides you with data storage, authentication, and real-time
capabilities.

## Getting Started

### API Key
You need an API key to make calls to your Supabase project. Connect with Supabase to generate a key.

### Installing the SDK
Supabase offers SDKs for various languages. Install the JavaScript SDK with:

```javascript
npm install @supabase/supabase-js
```

### Initializing a Client
Initialize your client connection to Supabase with your API key:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xyzcompany.supabase.co'
const supabaseKey = 'public-anon-key'
const supabase = createClient(supabaseUrl, supabaseKey)
```

## Best Practices
Follow these best practices to ensure optimal performance and reliability when using Supabase:

- Batch your network requests to limit the number of HTTP calls.
- Implement robust error handling and retry mechanisms.
- Monitor your usage and set up alerts to stay within quota limits.

## Detailed Guide
Search docs...
Search docs...
JavaScript Client Library
This reference documents every object and method available in Supabase's isomorphic JavaScript library, supabase-js. You can use supabase-js to interact with your Postgres database, listen to database changes, invoke Deno Edge Functions, build login and user management functionality, and manage large files.
```supabase-js```
```supabase-js```
```supabase-js```
```supabase-js```
Installing
Install as package#
You can install @supabase/supabase-js via the terminal.
```_10npm install @supabase/supabase-js```
Install via CDN#
You can install @supabase/supabase-js via CDN links.
```_10<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>_10//or_10<script src="https://unpkg.com/@supabase/supabase-js@2"></script>```
Use at runtime in Deno#
You can use supabase-js in the Deno runtime via JSR:
```_10  import { createClient } from 'jsr:@supabase/supabase-js@2'```
Initializing
Create a new client for use in the browser.
You can initialize a new Supabase client using the createClient() method.
```createClient()```
```createClient()```
The Supabase client is your entrypoint to the rest of the Supabase functionality and is the easiest way to interact with everything we offer within the Supabase ecosystem.
Parameters
The unique Supabase URL which is supplied when you create a new project in your project dashboard.
The unique Supabase Key which is supplied when you create a new project in your project dashboard.
```_10import { createClient } from '@supabase/supabase-js'_10_10// Create a single supabase client for interacting with your database_10const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key')```
TypeScript support
supabase-js has TypeScript support for type inference, autocompletion, type-safe queries, and more.
```supabase-js```
```supabase-js```
With TypeScript, supabase-js detects things like not null constraints and generated columns. Nullable columns are typed as T | null when you select the column. Generated columns will show a type error when you insert to it.
```supabase-js```
```not null```
```T | null```
```supabase-js```
```not null```
```T | null```
supabase-js also detects relationships between tables. A referenced table with one-to-many relationship is typed as T[]. Likewise, a referenced table with many-to-one relationship is typed as T | null.
```supabase-js```
```T[]```
```T | null```
```supabase-js```
```T[]```
```T | null```
Generating TypeScript Types#
You can use the Supabase CLI to generate the types. You can also generate the types from the dashboard.
```_10supabase gen types typescript --project-id abcdefghijklmnopqrst > database.types.ts```
These types are generated from your database schema. Given a table public.movies, the generated types will look like:
```public.movies```
```public.movies```
```_10create table public.movies (_10  id bigint generated always as identity primary key,_10  name text not null,_10  data jsonb null_10);```
```_25export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]_25_25export interface Database {_25  public: {_25    Tables: {_25      movies: {_25        Row: {               // the data expected from .select()_25          id: number_25          name: string_25          data: Json | null_25        }_25        Insert: {            // the data to be passed to .insert()_25          id?: never         // generated columns must not be supplied_25          name: string       // `not null` columns with no default must be supplied_25          data?: Json | null // nullable columns can be omitted_25        }_25        Update: {            // the data to be passed to .update()_25          id?: never_25          name?: string      // `not null` columns are optional on .update()_25          data?: Json | null_25        }_25      }_25    }_25  }_25}```
Using TypeScript type definitions#
You can supply the type definitions to supabase-js like so:
```supabase-js```
```supabase-js```
```_10import { createClient } from '@supabase/supabase-js'_10import { Database } from './database.types'_10_10const supabase = createClient<Database>(_10  process.env.SUPABASE_URL,_10  process.env.SUPABASE_ANON_KEY_10)```
Helper types for Tables and Joins#
You can use the following helper types to make the generated TypeScript types easier to use.
Sometimes the generated types are not what you expect. For example, a view's column may show up as nullable when you expect it to be not null. Using type-fest, you can override the types like so:
```not null```
```not null```
```_10export type Json = // ..._10_10export interface Database {_10  // ..._10}```
```_20import { MergeDeep } from 'type-fest'_20import { Database as DatabaseGenerated } from './database-generated.types'_20export { Json } from './database-generated.types'_20_20// Override the type for a specific column in a view:_20export type Database = MergeDeep<_20  DatabaseGenerated,_20  {_20    public: {_20      Views: {_20        movies_view: {_20          Row: {_20            // id is a primary key in public.movies, so it must be `not null`_20            id: number_20          }_20        }_20      }_20    }_20  }_20>```
You can also override the type of an individual successful response if needed:
```_10const { data } = await supabase.from('countries').select().returns<MyType>()```
The generated types provide shorthands for accessing tables and enums.
```_10import { Database, Tables, Enums } from "./database.types.ts";_10_10// Before 😕_10let movie: Database['public']['Tables']['movies']['Row'] = // ..._10_10// After 😍_10let movie: Tables<'movies'>```
Response types for complex queries#
supabase-js always returns a data object (for success), and an error object (for unsuccessful requests).
```supabase-js```
```data```
```error```
```supabase-js```
```data```
```error```
These helper types provide the result types from any query, including nested types for database joins.
Given the following schema with a relation between cities and countries, we can get the nested CountriesWithCities type:
```CountriesWithCities```
```CountriesWithCities```
```_10create table countries (_10  "id" serial primary key,_10  "name" text_10);_10_10create table cities (_10  "id" serial primary key,_10  "name" text,_10  "country_id" int references "countries"_10);```
```_17import { QueryResult, QueryData, QueryError } from '@supabase/supabase-js'_17_17const countriesWithCitiesQuery = supabase_17  .from("countries")_17  .select(`_17    id,_17    name,_17    cities (_17      id,_17      name_17    )_17  `);_17type CountriesWithCities = QueryData<typeof countriesWithCitiesQuery>;_17_17const { data, error } = await countriesWithCitiesQuery;_17if (error) throw error;_17const countriesWithCities: CountriesWithCities = data;```
Fetch data
Perform a SELECT query on the table or view.
```range()```
```select()```
```select()```
```apikey```
Parameters
The columns to retrieve, separated by commas. Columns can be renamed when returned with customName:columnName
```customName:columnName```
```customName:columnName```
Named parameters
```_10const { data, error } = await supabase_10  .from('countries')_10  .select()```
Insert data
Perform an INSERT into the table or view.
Parameters
The values to insert. Pass an object to insert a single row or an array to insert multiple rows.
Named parameters
```_10const { error } = await supabase_10  .from('countries')_10  .insert({ id: 1, name: 'Denmark' })```
Update data
Perform an UPDATE on the table or view.
```update()```
Parameters
The values to update with
Named parameters
```_10const { error } = await supabase_10  .from('countries')_10  .update({ name: 'Australia' })_10  .eq('id', 1)```
Upsert data
Perform an UPSERT on the table or view. Depending on the column(s) passed to onConflict, .upsert() allows you to perform the equivalent of .insert() if a row with the corresponding onConflict columns doesn't exist, or if it does exist, perform an alternative action depending on ignoreDuplicates.
```onConflict```
```.upsert()```
```.insert()```
```onConflict```
```ignoreDuplicates```
```onConflict```
```.upsert()```
```.insert()```
```onConflict```
```ignoreDuplicates```
```values```
Parameters
The values to upsert with. Pass an object to upsert a single row or an array to upsert multiple rows.
Named parameters
```_10const { data, error } = await supabase_10  .from('countries')_10  .upsert({ id: 1, name: 'Albania' })_10  .select()```
Delete data
Perform a DELETE on the table or view.
```delete()```
```delete()```
```SELECT```
```SELECT```
```ALL```
```delete().in()```
Parameters
Named parameters
```_10const response = await supabase_10  .from('countries')_10  .delete()_10  .eq('id', 1)```
Call a Postgres function
Perform a function call.
You can call Postgres functions as Remote Procedure Calls, logic in your database that you can execute from anywhere. Functions are useful when the logic rarely changes—like for password resets and updates.
```_10create or replace function hello_world() returns text as $$_10  select 'Hello world';_10$$ language sql;```
To call Postgres functions on Read Replicas, use the get: true option.
```get: true```
```get: true```
Parameters
The function name to call
The arguments to pass to the function call
Named parameters
```_10const { data, error } = await supabase.rpc('hello_world')```
Using filters
Filters allow you to only return rows that match certain conditions.
Filters can be used on select(), update(), upsert(), and delete() queries.
```select()```
```update()```
```upsert()```
```delete()```
```select()```
```update()```
```upsert()```
```delete()```
If a Postgres function returns a table response, you can also apply filters.
```_10const { data, error } = await supabase_10  .from('cities')_10  .select('name, country_id')_10  .eq('name', 'The Shire')    // Correct_10_10const { data, error } = await supabase_10  .from('cities')_10  .eq('name', 'The Shire')    // Incorrect_10  .select('name, country_id')```
Column is equal to a value
Match only rows where column is equal to value.
```column```
```value```
```column```
```value```
Parameters
The column to filter on
The value to filter with
```_10const { data, error } = await supabase_10  .from('countries')_10  .select()_10  .eq('name', 'Albania')```
Column is not equal to a value
Match only rows where column is not equal to value.
```column```
```value```
```column```
```value```
Parameters
The column to filter on
The value to filter with
```_10const { data, error } = await supabase_10  .from('countries')_10  .select()_10  .neq('name', 'Albania')```
Column is greater than a value
Match only rows where column is greater than value.
```column```
```value```
```column```
```value```
Parameters
The column to filter on
The value to filter with
```_10const { data, error } = await supabase_10  .from('countries')_10  .select()_10  .gt('id', 2)```
Column is greater than or equal to a value
Match only rows where column is greater than or equal to value.
```column```
```value```
```column```
```value```
Parameters
The column to filter on
The value to filter with
```_10const { data, error } = await supabase_10  .from('countries')_10  .select()_10  .gte('id', 2)```
Column is less than a value
Match only rows where column is less than value.
```column```
```value```
```column```
```value```
Parameters
The column to filter on
The value to filter with
```_10const { data, error } = await supabase_10  .from('countries')_10  .select()_10  .lt('id', 2)```
Column is less than or equal to a value
Match only rows where column is less than or equal to value.
```column```
```value```
```column```
```value```
Parameters
The column to filter on
The value to filter with
```_10const { data, error } = await supabase_10  .from('countries')_10  .select()_10  .lte('id', 2)```
Column matches a pattern
Match only rows where column matches pattern case-sensitively.
```column```
```pattern```
```column```
```pattern```
Parameters
The column to filter on
The pattern to match with
```_10const { data, error } = await supabase_10  .from('countries')_10  .select()_10  .like('name', '%Alba%')```
Column matches a case-insensitive pattern
Match only rows where column matches pattern case-insensitively.
```column```
```pattern```
```column```
```pattern```
Parameters
The column to filter on
The pattern to match with
```_10const { data, error } = await supabase_10  .from('countries')_10  .select()_10  .ilike('name', '%alba%')```
Column is a value
Match only rows where column IS value.
```column```
```value```
```column```
```value```
Parameters
The column to filter on
The value to filter with
```_10const { data, error } = await supabase_10  .from('countries')_10  .select()_10  .is('name', null)```
Column is in an array
Match only rows where column is included in the values array.
```column```
```values```
```column```
```values```
Parameters
The column to filter on
The values array to filter with
```_10const { data, error } = await supabase_10  .from('countries')_10  .select()_10  .in('name', ['Albania', 'Algeria'])```
Column contains every element in a value
Only relevant for jsonb, array, and range columns. Match only rows where column contains every element appearing in value.
```column```
```value```
```column```
```value```
Parameters
The jsonb, array, or range column to filter on
The jsonb, array, or range value to filter with
```_10const { data, error } = await supabase_10  .from('issues')_10  .select()_10  .contains('tags', ['is:open', 'priority:low'])```
Contained by value
Only relevant for jsonb, array, and range columns. Match only rows where every element appearing in column is contained by value.
```column```
```value```
```column```
```value```
Parameters
The jsonb, array, or range column to filter on
The jsonb, array, or range value to filter with
```_10const { data, error } = await supabase_10  .from('classes')_10  .select('name')_10  .containedBy('days', ['monday', 'tuesday', 'wednesday', 'friday'])```
Greater than a range
Only relevant for range columns. Match only rows where every element in column is greater than any element in range.
```column```
```range```
```column```
```range```
Parameters
The range column to filter on
The range to filter with
```_10const { data, error } = await supabase_10  .from('reservations')_10  .select()_10  .rangeGt('during', '[2000-01-02 08:00, 2000-01-02 09:00)')```
Greater than or equal to a range
Only relevant for range columns. Match only rows where every element in column is either contained in range or greater than any element in range.
```column```
```range```
```range```
```column```
```range```
```range```
Parameters
The range column to filter on
The range to filter with
```_10const { data, error } = await supabase_10  .from('reservations')_10  .select()_10  .rangeGte('during', '[2000-01-02 08:30, 2000-01-02 09:30)')```
Less than a range
Only relevant for range columns. Match only rows where every element in column is less than any element in range.
```column```
```range```
```column```
```range```
Parameters
The range column to filter on
The range to filter with
```_10const { data, error } = await supabase_10  .from('reservations')_10  .select()_10  .rangeLt('during', '[2000-01-01 15:00, 2000-01-01 16:00)')```
Less than or equal to a range
Only relevant for range columns. Match only rows where every element in column is either contained in range or less than any element in range.
```column```
```range```
```range```
```column```
```range```
```range```
Parameters
The range column to filter on
The range to filter with
```_10const { data, error } = await supabase_10  .from('reservations')_10  .select()_10  .rangeLte('during', '[2000-01-01 14:00, 2000-01-01 16:00)')```
Mutually exclusive to a range
Only relevant for range columns. Match only rows where column is mutually exclusive to range and there can be no element between the two ranges.
```column```
```range```
```column```
```range```
Parameters
The range column to filter on
The range to filter with
```_10const { data, error } = await supabase_10  .from('reservations')_10  .select()_10  .rangeAdjacent('during', '[2000-01-01 12:00, 2000-01-01 13:00)')```
With a common element
Only relevant for array and range columns. Match only rows where column and value have an element in common.
```column```
```value```
```column```
```value```
Parameters
The array or range column to filter on
The array or range value to filter with
```_10const { data, error } = await supabase_10  .from('issues')_10  .select('title')_10  .overlaps('tags', ['is:closed', 'severity:high'])```
Match a string
Only relevant for text and tsvector columns. Match only rows where column matches the query string in query.
```column```
```query```
```column```
```query```
Parameters
The text or tsvector column to filter on
The query text to match with
Named parameters
```_10const result = await supabase_10  .from("texts")_10  .select("content")_10  .textSearch("content", `'eggs' & 'ham'`, {_10    config: "english",_10  });```
Match an associated value
Match only rows where each column in query keys is equal to its associated value. Shorthand for multiple .eq()s.
```query```
```.eq()```
```query```
```.eq()```
Parameters
The object to filter with, with column names as keys mapped to their filter values
```_10const { data, error } = await supabase_10  .from('countries')_10  .select('name')_10  .match({ id: 2, name: 'Albania' })```
Don't match the filter
Match only rows which doesn't satisfy the filter.
not() expects you to use the raw PostgREST syntax for the filter values.
```_10.not('id', 'in', '(5,6,7)')  // Use `()` for `in` filter_10.not('arraycol', 'cs', '\{"a","b"\}')  // Use `cs` for `contains()`, `\{\}` for array values```
Parameters
The column to filter on
The operator to be negated to filter with, following PostgREST syntax
The value to filter with, following PostgREST syntax
```_10const { data, error } = await supabase_10  .from('countries')_10  .select()_10  .not('name', 'is', null)```
Match at least one filter
Match only rows which satisfy at least one of the filters.
or() expects you to use the raw PostgREST syntax for the filter names and values.
```_10.or('id.in.(5,6,7), arraycol.cs.\{"a","b"\}')  // Use `()` for `in` filter, `\{\}` for array values and `cs` for `contains()`._10.or('id.in.(5,6,7), arraycol.cd.\{"a","b"\}')  // Use `cd` for `containedBy()````
Parameters
The filters to use, following PostgREST syntax
Named parameters
```_10const { data, error } = await supabase_10  .from('countries')_10  .select('name')_10  .or('id.eq.2,name.eq.Algeria')```
Match the filter
Match only rows which satisfy the filter. This is an escape hatch - you should use the specific filter methods wherever possible.
filter() expects you to use the raw PostgREST syntax for the filter values.
```_10.filter('id', 'in', '(5,6,7)')  // Use `()` for `in` filter_10.filter('arraycol', 'cs', '\{"a","b"\}')  // Use `cs` for `contains()`, `\{\}` for array values```
Parameters
The column to filter on
The operator to filter with, following PostgREST syntax
The value to filter with, following PostgREST syntax
```_10const { data, error } = await supabase_10  .from('countries')_10  .select()_10  .filter('name', 'in', '("Algeria","Japan")')```
Using modifiers
Filters work on the row level—they allow you to return rows that only match certain conditions without changing the shape of the rows. Modifiers are everything that don't fit that definition—allowing you to change the format of the response (e.g., returning a CSV string).
Modifiers must be specified after filters. Some modifiers only apply for queries that return rows (e.g., select() or rpc() on a function that returns a table response).
```select()```
```rpc()```
```select()```
```rpc()```
Return data after inserting
Perform a SELECT on the query result.
Parameters
The columns to retrieve, separated by commas
```_10const { data, error } = await supabase_10  .from('countries')_10  .upsert({ id: 1, name: 'Algeria' })_10  .select()```
Order the results
Order the query result by column.
```column```
```column```
Parameters
The column to order by
Named parameters
```_10const { data, error } = await supabase_10  .from('countries')_10  .select('id', 'name')_10  .order('id', { ascending: false })```
Limit the number of rows returned
Limit the query result by count.
```count```
```count```
Parameters
The maximum number of rows to return
Named parameters
```_10const { data, error } = await supabase_10  .from('countries')_10  .select('name')_10  .limit(1)```
Limit the query to a range
Limit the query result by starting at an offset (from) and ending at the offset (from + to). Only records within this range are returned. This respects the query order and if there is no order clause the range could behave unexpectedly. The from and to values are 0-based and inclusive: range(1, 3) will include the second, third and fourth rows of the query.
```from```
```from + to```
```from```
```to```
```range(1, 3)```
```from```
```from + to```
```from```
```to```
```range(1, 3)```
Parameters
The starting index from which to limit the result
The last index to which to limit the result
Named parameters
```_10const { data, error } = await supabase_10  .from('countries')_10  .select('name')_10  .range(0, 1)```
Set an abort signal
Set the AbortSignal for the fetch request.
You can use this to set a timeout for the request.
Parameters
The AbortSignal to use for the fetch request
```_10const ac = new AbortController()_10ac.abort()_10const { data, error } = await supabase_10  .from('very_big_table')_10  .select()_10  .abortSignal(ac.signal)```
Retrieve one row of data
Return data as a single object instead of an array of objects.
```data```
```data```
```_10const { data, error } = await supabase_10  .from('countries')_10  .select('name')_10  .limit(1)_10  .single()```
Retrieve zero or one row of data
Return data as a single object instead of an array of objects.
```data```
```data```
Return Type
```_10const { data, error } = await supabase_10  .from('countries')_10  .select()_10  .eq('name', 'Singapore')_10  .maybeSingle()```
Retrieve as a CSV
Return data as a string in CSV format.
```data```
```data```
Return Type
```_10const { data, error } = await supabase_10  .from('countries')_10  .select()_10  .csv()```
Override type of successful response
Override the type of the returned data.
```data```
```data```
```_10const { data } = await supabase_10  .from('countries')_10  .select()_10  .returns<MyType>()```
Using explain
Return data as the EXPLAIN plan for the query.
```data```
```data```
For debugging slow queries, you can get the Postgres EXPLAIN execution plan of a query using the explain() method. This works on any query, even for rpc() or writes.
```EXPLAIN```
```explain()```
```rpc()```
```EXPLAIN```
```explain()```
```rpc()```
Explain is not enabled by default as it can reveal sensitive information about your database. It's best to only enable this for testing environments but if you wish to enable it for production you can provide additional protection by using a pre-request function.
```pre-request```
```pre-request```
Follow the Performance Debugging Guide to enable the functionality on your project.
Parameters
Named parameters
Return Type
```_10const { data, error } = await supabase_10  .from('countries')_10  .select()_10  .explain()```
Overview
The auth methods can be accessed via the supabase.auth namespace.
```supabase.auth```
```supabase.auth```
By default, the supabase client sets persistSession to true and attempts to store the session in local storage. When using the supabase client in an environment that doesn't support local storage, you might notice the following warning message being logged:
```persistSession```
```persistSession```
No storage option exists to persist the session, which may result in unexpected behavior when using auth. If you want to set persistSession to true, please provide a storage option or you may set persistSession to false to disable this warning.
```persistSession```
```persistSession```
```persistSession```
```persistSession```
This warning message can be safely ignored if you're not using auth on the server-side. If you are using auth and you want to set persistSession to true, you will need to provide a custom storage implementation that follows this interface.
```persistSession```
```persistSession```
Any email links and one-time passwords (OTPs) sent have a default expiry of 24 hours. We have the following rate limits in place to guard against brute force attacks.
The expiry of an access token can be set in the "JWT expiry limit" field in your project's auth settings. A refresh token never expires and can only be used once.
```_10import { createClient } from '@supabase/supabase-js'_10_10const supabase = createClient(supabase_url, anon_key)```
Create a new user
Creates a new user.
```user```
```session```
```user```
```session```
```SITE_URL```
```SITE_URL```
```User already registered```
```getUser()```
Parameters
Return Type
```_10const { data, error } = await supabase.auth.signUp({_10  email: '[email protected]',_10  password: 'example-password',_10})```
Listen to auth events
Receive a notification every time an auth event happens.
```async```
```await```
```async```
```await```
```async```
```_10supabase.auth.onAuthStateChange((event, session) => \{_10  setTimeout(async () => \{_10    // await on other Supabase function here_10    // this runs right after the callback has finished_10  \}, 0)_10\})```
```INITIAL_SESSION```
```SIGNED_IN```
```SIGNED_OUT```
```supabase.auth.signOut()```
```TOKEN_REFRESHED```
```supabase.auth.getSession()```
```USER_UPDATED```
```supabase.auth.updateUser()```
```PASSWORD_RECOVERY```
```SIGNED_IN```
Parameters
A callback function to be invoked when an auth event happens.
Return Type
```_20const { data } = supabase.auth.onAuthStateChange((event, session) => {_20  console.log(event, session)_20_20  if (event === 'INITIAL_SESSION') {_20    // handle initial session_20  } else if (event === 'SIGNED_IN') {_20    // handle sign in event_20  } else if (event === 'SIGNED_OUT') {_20    // handle sign out event_20  } else if (event === 'PASSWORD_RECOVERY') {_20    // handle password recovery event_20  } else if (event === 'TOKEN_REFRESHED') {_20    // handle token refreshed event_20  } else if (event === 'USER_UPDATED') {_20    // handle user updated event_20  }_20})_20_20// call unsubscribe to remove the callback_20data.subscription.unsubscribe()```
Create an anonymous user
Creates a new anonymous user.
```options```
Parameters
Return Type
```_10const { data, error } = await supabase.auth.signInAnonymously({_10  options: {_10    captchaToken_10  }_10});```
Sign in a user
Log in an existing user with an email and password or phone and password.
Parameters
Return Type
```_10const { data, error } = await supabase.auth.signInWithPassword({_10  email: '[email protected]',_10  password: 'example-password',_10})```
Sign in with ID Token
Allows signing in with an OIDC ID token. The authentication provider used should be enabled and configured.
Parameters
Return Type
```_10const { data, error } = await supabase.auth.signInWithIdToken({_10  provider: 'google',_10  token: 'your-id-token'_10})```
Sign in a user through OTP
Log in a user using magiclink or a one-time password (OTP).
```signInWithOtp()```
```shouldCreateUser```
```SignInWithPasswordlessCredentials.options```
```false```
```SITE_URL```
```\{\{ .Token \}\}```
```\{\{ .ConfirmationURL \}\}```
Parameters
Return Type
```_10const { data, error } = await supabase.auth.signInWithOtp({_10  email: '[email protected]',_10  options: {_10    emailRedirectTo: 'https://example.com/welcome'_10  }_10})```
Sign in a user through OAuth
Log in an existing user via a third-party provider. This method supports the PKCE flow.
Parameters
Return Type
```_10const { data, error } = await supabase.auth.signInWithOAuth({_10  provider: 'github'_10})```
Sign in a user through SSO
Attempts a single-sign on using an enterprise Identity Provider. A successful SSO attempt will redirect the current page to the identity provider authorization page. The redirect URL is implementation and SSO protocol specific.
```domain```
```providerId```
Parameters
Return Type
```_11  // You can extract the user's email domain and use it to trigger the_11  // authentication flow with the correct identity provider._11_11  const { data, error } = await supabase.auth.signInWithSSO({_11    domain: 'company.com'_11  })_11_11  if (data?.url) {_11    // redirect the user to the identity provider's authentication flow_11    window.location.href = data.url_11  }```
Sign out a user
Inside a browser context, signOut() will remove the logged in user from the browser session and log them out - removing all items from localstorage and then trigger a "SIGNED_OUT" event.
```signOut()```
```"SIGNED_OUT"```
```signOut()```
```"SIGNED_OUT"```
```signOut()```
```signOut()```
Parameters
Return Type
```_10const { error } = await supabase.auth.signOut()```
Send a password reset request
Sends a password reset request to an email address. This method supports the PKCE flow.
```resetPasswordForEmail()```
```updateUser()```
```SIGNED_IN```
```PASSWORD_RECOVERY```
```onAuthStateChange()```
```redirectTo```
```updateUser()```
```_10const \{ data, error \} = await supabase.auth.updateUser(\{_10  password: new_password_10\})```
Parameters
The email address of the user.
Return Type
```_10const { data, error } = await supabase.auth.resetPasswordForEmail(email, {_10  redirectTo: 'https://example.com/update-password',_10})```
Verify and log in through OTP
Log in a user given a User supplied OTP or TokenHash received through mobile or email.
```verifyOtp```
```sms```
```phone_change```
```email```
```recovery```
```invite```
```email_change```
```signup```
```magiclink```
```verifyOtp```
```TokenHash```
Parameters
Return Type
```_10const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email'})```
Retrieve a session
Returns the session, refreshing it if necessary.
```getUser```
Return Type
```_10const { data, error } = await supabase.auth.getSession()```
Retrieve a new session
Returns a new session, regardless of expiry status. Takes in an optional current session. If not passed in, then refreshSession() will attempt to retrieve it from getSession(). If the current session's refresh token is invalid, an error will be thrown.
Parameters
The current session. If passed in, it must contain a refresh token.
Return Type
```_10const { data, error } = await supabase.auth.refreshSession()_10const { session, user } = data```
Retrieve a user
Gets the current user details if there is an existing session. This method performs a network request to the Supabase Auth server, so the returned value is authentic and can be used to base authorization rules on.
```getSession().session.user```
```getSession```
Parameters
Takes in an optional access token JWT. If no JWT is provided, the JWT from the current session is used.
Return Type
```_10const { data: { user } } = await supabase.auth.getUser()```
Update a user
Updates user data for a logged in user.
```updateUser()```
Parameters
Return Type
```_10const { data, error } = await supabase.auth.updateUser({_10  email: '[email protected]'_10})```
Retrieve identities linked to a user
Gets all the identities linked to a user.
```getUserIdentities()```
Return Type
```_10const { data, error } = await supabase.auth.getUserIdentities()```
Link an identity to a user
Links an oauth identity to an existing user. This method supports the PKCE flow.
```linkIdentity()```
```linkIdentity()```
```linkIdentity```
Parameters
Return Type
```_10const { data, error } = await supabase.auth.linkIdentity({_10  provider: 'github'_10})```
Unlink an identity from a user
Unlinks an identity from a user by deleting it. The user will no longer be able to sign in with that identity once it's unlinked.
```unlinkIdentity()```
Parameters
Return Type
```_10// retrieve all identites linked to a user_10const identities = await supabase.auth.getUserIdentities()_10_10// find the google identity _10const googleIdentity = identities.find(_10  identity => identity.provider === 'google'_10)_10_10// unlink the google identity_10const { error } = await supabase.auth.unlinkIdentity(googleIdentity)```
Send a password reauthentication nonce
Sends a reauthentication OTP to the user's email or phone number. Requires the user to be signed-in.
```updateUser()```
Return Type
```_10const { error } = await supabase.auth.reauthenticate()```
Resend an OTP
Resends an existing signup confirmation email, email change email, SMS OTP or phone change OTP.
```signInWithOtp()```
```resetPasswordForEmail()```
```emailRedirectTo```
Parameters
Return Type
```_10const { error } = await supabase.auth.resend({_10  type: 'signup',_10  email: '[email protected]',_10  options: {_10    emailRedirectTo: 'https://example.com/welcome'_10  }_10})```
Set the session data
Sets the session data from the current session. If the current session is expired, setSession will take care of refreshing it to obtain a new session. If the refresh token or access token in the current session is invalid, an error will be thrown.
```access_token```
```refresh_token```
```SIGNED_IN```
Parameters
The current session that minimally contains an access token and refresh token.
Return Type
```_10  const { data, error } = await supabase.auth.setSession({_10    access_token,_10    refresh_token_10  })```
Exchange an auth code for a session
Log in an existing user by exchanging an Auth Code issued during the PKCE flow.
```flowType```
```pkce```
Parameters
Return Type
```_10supabase.auth.exchangeCodeForSession('34e770dd-9ff9-416c-87fa-43b31d7ef225')```
Start auto-refresh session (non-browser)
Starts an auto-refresh process in the background. The session is checked every few seconds. Close to the time of expiration a process is started to refresh the session. If refreshing fails it will be retried for as long as necessary.
```supabase.auth.stopAutoRefresh()```
Return Type
```_10import { AppState } from 'react-native'_10_10// make sure you register this only once!_10AppState.addEventListener('change', (state) => {_10  if (state === 'active') {_10    supabase.auth.startAutoRefresh()_10  } else {_10    supabase.auth.stopAutoRefresh()_10  }_10})```
Stop auto-refresh session (non-browser)
Stops an active auto refresh process running in the background (if any).
Return Type
```_10import { AppState } from 'react-native'_10_10// make sure you register this only once!_10AppState.addEventListener('change', (state) => {_10  if (state === 'active') {_10    supabase.auth.startAutoRefresh()_10  } else {_10    supabase.auth.stopAutoRefresh()_10  }_10})```
Auth MFA
This section contains methods commonly used for Multi-Factor Authentication (MFA) and are invoked behind the supabase.auth.mfa namespace.
```supabase.auth.mfa```
```supabase.auth.mfa```
Currently, there is support for time-based one-time password (TOTP) and phone verification code as the 2nd factor. Recovery codes are not supported but users can enroll multiple factors, with an upper limit of 10.
Having a 2nd factor for recovery frees the user of the burden of having to store their recovery codes somewhere. It also reduces the attack surface since multiple recovery codes are usually generated compared to just having 1 backup factor.
Enroll a factor
Starts the enrollment process for a new Multi-Factor Authentication (MFA) factor. This method creates a new unverified factor. To verify a factor, present the QR code or secret to the user and ask them to add it to their authenticator app. The user has to enter the code from their authenticator app to verify it.
```unverified```
```unverified```
```totp```
```phone```
```factorType```
```id```
```mfa.challenge()```
```mfa.verify()```
```mfa.challengeAndVerify()```
```totp```
```_10<Image src=\{data.totp.qr_code\} alt=\{data.totp.uri\} layout="fill"></Image>```
```challenge```
```verify```
Parameters
Return Type
```_10const { data, error } = await supabase.auth.mfa.enroll({_10  factorType: 'totp',_10  friendlyName: 'your_friendly_name'_10})_10_10// Use the id to create a challenge._10// The challenge can be verified by entering the code generated from the authenticator app._10// The code will be generated upon scanning the qr_code or entering the secret into the authenticator app._10const { id, type, totp: { qr_code, secret, uri }, friendly_name } = data_10const challenge = await supabase.auth.mfa.challenge({ factorId: id });```
Create a challenge
Prepares a challenge used to verify that a user has access to a MFA factor.
```mfa.verify()```
```sms```
Parameters
Return Type
```_10const { data, error } = await supabase.auth.mfa.challenge({_10  factorId: '34e770dd-9ff9-416c-87fa-43b31d7ef225'_10})```
Verify a challenge
Verifies a code against a challenge. The verification code is provided by the user by entering a code seen in their authenticator app.
Parameters
Return Type
```_10const { data, error } = await supabase.auth.mfa.verify({_10  factorId: '34e770dd-9ff9-416c-87fa-43b31d7ef225',_10  challengeId: '4034ae6f-a8ce-4fb5-8ee5-69a5863a7c15',_10  code: '123456'_10})```
Create and verify a challenge
Helper method which creates a challenge and immediately uses the given code to verify against it thereafter. The verification code is provided by the user by entering a code seen in their authenticator app.
```challengeAndVerify()```
```mfa.challenge()```
```mfa.verify()```
Parameters
Return Type
```_10const { data, error } = await supabase.auth.mfa.challengeAndVerify({_10  factorId: '34e770dd-9ff9-416c-87fa-43b31d7ef225',_10  code: '123456'_10})```
Unenroll a factor
Unenroll removes a MFA factor. A user has to have an aal2 authenticator level in order to unenroll a verified factor.
```aal2```
```verified```
```aal2```
```verified```
Parameters
Return Type
```_10const { data, error } = await supabase.auth.mfa.unenroll({_10  factorId: '34e770dd-9ff9-416c-87fa-43b31d7ef225',_10})```
Get Authenticator Assurance Level
Returns the Authenticator Assurance Level (AAL) for the active session.
```aal1```
```aal2```
```nextLevel```
```aal2```
```aal1```
Return Type
```_10const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()_10const { currentLevel, nextLevel, currentAuthenticationMethods } = data```
Auth Admin
```supabase.auth.admin```
```service_role```
```service_role```
```_11import { createClient } from '@supabase/supabase-js'_11_11const supabase = createClient(supabase_url, service_role_key, {_11  auth: {_11    autoRefreshToken: false,_11    persistSession: false_11  }_11})_11_11// Access auth admin api_11const adminAuthClient = supabase.auth.admin```
Retrieve a user
Get user by id.
```getUserById()```
```auth.users.id```
Parameters
The user's unique identifier
This function should only be called on a server. Never expose your service_role key in the browser.
```service_role```
```service_role```
Return Type
```_10const { data, error } = await supabase.auth.admin.getUserById(1)```
List all users
Get a list of users.
Parameters
An object which supports page and perPage as numbers, to alter the paginated results.
```page```
```perPage```
```page```
```perPage```
Return Type
```_10const { data: { users }, error } = await supabase.auth.admin.listUsers()```
Create a user
Creates a new user. This function should only be called on a server. Never expose your service_role key in the browser.
```service_role```
```service_role```
```email_confirm```
```phone_confirm```
```createUser()```
```inviteUserByEmail()```
```email_confirm```
```phone_confirm```
```true```
Parameters
Return Type
```_10const { data, error } = await supabase.auth.admin.createUser({_10  email: '[email protected]',_10  password: 'password',_10  user_metadata: { name: 'Yoda' }_10})```
Delete a user
Delete a user. Requires a service_role key.
```service_role```
```service_role```
```deleteUser()```
```auth.users.id```
Parameters
The user id you want to remove.
If true, then the user will be soft-deleted (setting deleted_at to the current timestamp and disabling their account while preserving their data) from the auth schema. Defaults to false for backward compatibility.
```deleted_at```
```deleted_at```
This function should only be called on a server. Never expose your service_role key in the browser.
```service_role```
```service_role```
Return Type
```_10const { data, error } = await supabase.auth.admin.deleteUser(_10  '715ed5db-f090-4b8c-a067-640ecee36aa0'_10)```
Send an email invite link
Sends an invite link to an email address.
```inviteUserByEmail()```
```inviteUserByEmail```
Parameters
The email address of the user.
Additional options to be included when inviting.
Return Type
```_10const { data, error } = await supabase.auth.admin.inviteUserByEmail('[email protected]')```
Generate an email link
Generates email links and OTPs to be sent via a custom email provider.
```generateLink()```
```signup```
```magiclink```
```invite```
```recovery```
```email_change_current```
```email_change_new```
```phone_change```
```generateLink()```
```email_change_email```
```generateLink()```
```signup```
```invite```
```magiclink```
Parameters
Return Type
```_10const { data, error } = await supabase.auth.admin.generateLink({_10  type: 'signup',_10  email: '[email protected]',_10  password: 'secret'_10})```
Update a user
Updates the user data.
Parameters
The data you want to update.
This function should only be called on a server. Never expose your service_role key in the browser.
```service_role```
```service_role```
Return Type
```_10const { data: user, error } = await supabase.auth.admin.updateUserById(_10  '11111111-1111-1111-1111-111111111111',_10  { email: '[email protected]' }_10)```
Delete a factor for a user
Deletes a factor on a user. This will log the user out of all active sessions if the deleted factor was verified.
Parameters
Return Type
```_10const { data, error } = await supabase.auth.admin.mfa.deleteFactor({_10  id: '34e770dd-9ff9-416c-87fa-43b31d7ef225',_10  userId: 'a89baba7-b1b7-440f-b4bb-91026967f66b',_10})```
Invokes a Supabase Edge Function.
Invokes a function
Invoke a Supabase Edge Function.
```Blob```
```ArrayBuffer```
```File```
```FormData```
```String```
```json```
```Content-Type```
```application/json```
```Content-Type```
```json```
```blob```
```form-data```
```Content-Type```
```text```
Parameters
The name of the Function to invoke.
Options for invoking the Function.
Return Type
```_10const { data, error } = await supabase.functions.invoke('hello', {_10  body: { foo: 'bar' }_10})```
Subscribe to channel
Creates an event handler that listens to changes.
```REPLICA IDENTITY```
```FULL```
```ALTER TABLE your_table REPLICA IDENTITY FULL;```
Parameters
```_13const channel = supabase.channel("room1")_13_13channel.on("broadcast", { event: "cursor-pos" }, (payload) => {_13  console.log("Cursor position received!", payload);_13}).subscribe((status) => {_13  if (status === "SUBSCRIBED") {_13    channel.send({_13      type: "broadcast",_13      event: "cursor-pos",_13      payload: { x: Math.random(), y: Math.random() },_13    });_13  }_13});```
Unsubscribe from a channel
Unsubscribes and removes Realtime channel from Realtime client.
Parameters
The name of the Realtime channel.
Return Type
```_10supabase.removeChannel(myChannel)```
Unsubscribe from all channels
Unsubscribes and removes all Realtime channels from Realtime client.
Return Type
```_10supabase.removeAllChannels()```
Retrieve all channels
Returns all Realtime channels.
Return Type
```_10const channels = supabase.getChannels()```
Broadcast a message
Sends a message into the channel.
Broadcast a message to all connected clients to a channel.
Parameters
Arguments to send to channel
Options to be used during the send process
Return Type
```_11supabase_11  .channel('room1')_11  .subscribe((status) => {_11    if (status === 'SUBSCRIBED') {_11      channel.send({_11        type: 'broadcast',_11        event: 'cursor-pos',_11        payload: { x: Math.random(), y: Math.random() },_11      })_11    }_11  })```
Create a bucket
Creates a new Storage bucket
```buckets```
```insert```
```objects```
Parameters
A unique identifier for the bucket you are creating.
Return Type
```_10const { data, error } = await supabase_10  .storage_10  .createBucket('avatars', {_10    public: false,_10    allowedMimeTypes: ['image/png'],_10    fileSizeLimit: 1024_10  })```
Retrieve a bucket
Retrieves the details of an existing Storage bucket.
```buckets```
```select```
```objects```
Parameters
The unique identifier of the bucket you would like to retrieve.
Return Type
```_10const { data, error } = await supabase_10  .storage_10  .getBucket('avatars')```
List all buckets
Retrieves the details of all Storage buckets within an existing project.
```buckets```
```select```
```objects```
Return Type
```_10const { data, error } = await supabase_10  .storage_10  .listBuckets()```
Update a bucket
Updates a Storage bucket
```buckets```
```select```
```update```
```objects```
Parameters
A unique identifier for the bucket you are updating.
Return Type
```_10const { data, error } = await supabase_10  .storage_10  .updateBucket('avatars', {_10    public: false,_10    allowedMimeTypes: ['image/png'],_10    fileSizeLimit: 1024_10  })```
Delete a bucket
Deletes an existing bucket. A bucket can't be deleted with existing objects inside it. You must first empty() the bucket.
```empty()```
```empty()```
```buckets```
```select```
```delete```
```objects```
Parameters
The unique identifier of the bucket you would like to delete.
Return Type
```_10const { data, error } = await supabase_10  .storage_10  .deleteBucket('avatars')```
Empty a bucket
Removes all objects inside a single bucket.
```buckets```
```select```
```objects```
```select```
```delete```
Parameters
The unique identifier of the bucket you would like to empty.
Return Type
```_10const { data, error } = await supabase_10  .storage_10  .emptyBucket('avatars')```
Upload a file
Uploads a file to an existing bucket.
```buckets```
```objects```
```insert```
```select```
```insert```
```update```
```Blob```
```File```
```FormData```
```ArrayBuffer```
Parameters
The file path, including the file name. Should be of the format folder/subfolder/filename.png. The bucket must already exist before attempting to upload.
```folder/subfolder/filename.png```
```folder/subfolder/filename.png```
The body of the file to be stored in the bucket.
Return Type
```_10const avatarFile = event.target.files[0]_10const { data, error } = await supabase_10  .storage_10  .from('avatars')_10  .upload('public/avatar1.png', avatarFile, {_10    cacheControl: '3600',_10    upsert: false_10  })```
Download a file
Downloads a file from a private bucket. For public buckets, make a request to the URL returned from getPublicUrl instead.
```getPublicUrl```
```getPublicUrl```
```buckets```
```objects```
```select```
Parameters
The full path and file name of the file to be downloaded. For example folder/image.png.
```folder/image.png```
```folder/image.png```
Return Type
```_10const { data, error } = await supabase_10  .storage_10  .from('avatars')_10  .download('folder/avatar1.png')```
List all files in a bucket
Lists all the files within a bucket.
```buckets```
```objects```
```select```
Parameters
The folder path.
Return Type
```_10const { data, error } = await supabase_10  .storage_10  .from('avatars')_10  .list('folder', {_10    limit: 100,_10    offset: 0,_10    sortBy: { column: 'name', order: 'asc' },_10  })```
Replace an existing file
Replaces an existing file at the specified path with a new one.
```buckets```
```objects```
```update```
```select```
```Blob```
```File```
```FormData```
```ArrayBuffer```
Parameters
The relative file path. Should be of the format folder/subfolder/filename.png. The bucket must already exist before attempting to update.
```folder/subfolder/filename.png```
```folder/subfolder/filename.png```
The body of the file to be stored in the bucket.
Return Type
```_10const avatarFile = event.target.files[0]_10const { data, error } = await supabase_10  .storage_10  .from('avatars')_10  .update('public/avatar1.png', avatarFile, {_10    cacheControl: '3600',_10    upsert: true_10  })```
Move an existing file
Moves an existing file to a new path in the same bucket.
```buckets```
```objects```
```update```
```select```
Parameters
The original file path, including the current file name. For example folder/image.png.
```folder/image.png```
```folder/image.png```
The new file path, including the new file name. For example folder/image-new.png.
```folder/image-new.png```
```folder/image-new.png```
Return Type
```_10const { data, error } = await supabase_10  .storage_10  .from('avatars')_10  .move('public/avatar1.png', 'private/avatar2.png')```
Copy an existing file
Copies an existing file to a new path in the same bucket.
```buckets```
```objects```
```insert```
```select```
Parameters
The original file path, including the current file name. For example folder/image.png.
```folder/image.png```
```folder/image.png```
The new file path, including the new file name. For example folder/image-copy.png.
```folder/image-copy.png```
```folder/image-copy.png```
Return Type
```_10const { data, error } = await supabase_10  .storage_10  .from('avatars')_10  .copy('public/avatar1.png', 'private/avatar2.png')```
Delete files in a bucket
Deletes files within the same bucket
```buckets```
```objects```
```delete```
```select```
Parameters
An array of files to delete, including the path and file name. For example ['folder/image.png'].
```'folder/image.png'```
```'folder/image.png'```
Return Type
```_10const { data, error } = await supabase_10  .storage_10  .from('avatars')_10  .remove(['folder/avatar1.png'])```
Create a signed URL
Creates a signed URL. Use a signed URL to share a file for a fixed amount of time.
```buckets```
```objects```
```select```
Parameters
The file path, including the current file name. For example folder/image.png.
```folder/image.png```
```folder/image.png```
The number of seconds until the signed URL expires. For example, 60 for a URL which is valid for one minute.
```60```
```60```
Return Type
```_10const { data, error } = await supabase_10  .storage_10  .from('avatars')_10  .createSignedUrl('folder/avatar1.png', 60)```
Create signed URLs
Creates multiple signed URLs. Use a signed URL to share a file for a fixed amount of time.
```buckets```
```objects```
```select```
Parameters
The file paths to be downloaded, including the current file names. For example ['folder/image.png', 'folder2/image2.png'].
```['folder/image.png', 'folder2/image2.png']```
```['folder/image.png', 'folder2/image2.png']```
The number of seconds until the signed URLs expire. For example, 60 for URLs which are valid for one minute.
```60```
```60```
Return Type
```_10const { data, error } = await supabase_10  .storage_10  .from('avatars')_10  .createSignedUrls(['folder/avatar1.png', 'folder/avatar2.png'], 60)```
Create signed upload URL
Creates a signed upload URL. Signed upload URLs can be used to upload files to the bucket without further authentication. They are valid for 2 hours.
```buckets```
```objects```
```insert```
Parameters
The file path, including the current file name. For example folder/image.png.
```folder/image.png```
```folder/image.png```
Return Type
```_10const { data, error } = await supabase_10  .storage_10  .from('avatars')_10  .createSignedUploadUrl('folder/cat.jpg')```
Upload to a signed URL
Upload a file with a token generated from createSignedUploadUrl.
```createSignedUploadUrl```
```createSignedUploadUrl```
```buckets```
```objects```
Parameters
The file path, including the file name. Should be of the format folder/subfolder/filename.png. The bucket must already exist before attempting to upload.
```folder/subfolder/filename.png```
```folder/subfolder/filename.png```
The token generated from createSignedUploadUrl
```createSignedUploadUrl```
```createSignedUploadUrl```
The body of the file to be stored in the bucket.
Return Type
```_10const { data, error } = await supabase_10  .storage_10  .from('avatars')_10  .uploadToSignedUrl('folder/cat.jpg', 'token-from-createSignedUploadUrl', file)```
Retrieve public URL
A simple convenience function to get the URL for an asset in a public bucket. If you do not want to use this function, you can construct the public URL by concatenating the bucket URL with the path to the asset. This function does not verify if the bucket is public. If a public URL is created for a bucket which is not public, you will not be able to download the asset.
```buckets```
```objects```
Parameters
The path and name of the file to generate the public URL for. For example folder/image.png.
```folder/image.png```
```folder/image.png```
Return Type
```_10const { data } = supabase_10  .storage_10  .from('public-bucket')_10  .getPublicUrl('folder/avatar1.png')```
Release Notes
Supabase.js v2 release notes.
Install the latest version of @supabase/supabase-js
```_10  npm install @supabase/supabase-js```
Explicit constructor options#
All client specific options within the constructor are keyed to the library.
See PR:
```_19  const supabase = createClient(apiURL, apiKey, {_19    db: {_19      schema: 'public',_19    },_19    auth: {_19      storage: AsyncStorage,_19      autoRefreshToken: true,_19      persistSession: true,_19      detectSessionInUrl: true,_19    },_19    realtime: {_19      channels,_19      endpoint,_19    },_19    global: {_19      fetch: customFetch,_19      headers: DEFAULT_HEADERS,_19    },_19  })```
TypeScript support#
The libraries now support typescript.
```_10  // previously definitions were injected in the `from()` method_10  supabase.from<Definitions['Message']>('messages').select('\*')```
```_10  import type { Database } from './DatabaseDefinitions'_10_10  // definitions are injected in `createClient()`_10  const supabase = createClient<Database>(SUPABASE_URL, ANON_KEY)_10_10  const { data } = await supabase.from('messages').select().match({ id: 1 })```
Types can be generated via the CLI:
```_10supabase start_10supabase gen types typescript --local > DatabaseDefinitions.ts```
Data operations return minimal#
.insert() / .upsert() / .update() / .delete() don't return rows by default: PR.
```.insert()```
```.upsert()```
```.update()```
```.delete()```
```.insert()```
```.upsert()```
```.update()```
```.delete()```
Previously, these methods return inserted/updated/deleted rows by default (which caused some confusion), and you can opt to not return it by specifying returning: 'minimal'. Now the default behavior is to not return rows. To return inserted/updated/deleted rows, add a .select() call at the end, e.g.:
```returning: 'minimal'```
```.select()```
```returning: 'minimal'```
```.select()```
```_10const { data, error } = await supabase_10    .from('my_table')_10    .delete()_10    .eq('id', 1)_10    .select()```
New ordering defaults#
.order() now defaults to Postgres’s default: PR.
```.order()```
```.order()```
Previously nullsFirst defaults to false , meaning nulls are ordered last. This is bad for performance if e.g. the column uses an index with NULLS FIRST (which is the default direction for indexes).
```nullsFirst```
```false```
```null```
```NULLS FIRST```
```nullsFirst```
```false```
```null```
```NULLS FIRST```
Cookies and localstorage namespace#
Storage key name in the Auth library has changed to include project reference which means that existing websites that had their JWT expiry set to a longer time could find their users logged out with this upgrade.
```_10const defaultStorageKey = `sb-${new URL(this.authUrl).hostname.split('.')[0]}-auth-token````
New Auth Types#
Typescript typings have been reworked. Session interface now guarantees that it will always have an access_token, refresh_token and user
```Session```
```access_token```
```refresh_token```
```user```
```Session```
```access_token```
```refresh_token```
```user```
```_10interface Session {_10  provider_token?: string | null_10  access_token: string_10  expires_in?: number_10  expires_at?: number_10  refresh_token: string_10  token_type: string_10  user: User_10}```
New Auth methods#
We're removing the signIn() method in favor of more explicit function signatures:
signInWithPassword(), signInWithOtp(), and signInWithOAuth().
```signIn()```
```signInWithPassword()```
```signInWithOtp()```
```signInWithOAuth()```
```signIn()```
```signInWithPassword()```
```signInWithOtp()```
```signInWithOAuth()```
```_10  const { data } = await supabase.auth.signIn({_10    email: 'hello@example',_10    password: 'pass',_10  })```
```_10  const { data } = await supabase.auth.signInWithPassword({_10    email: 'hello@example',_10    password: 'pass',_10  })```
New Realtime methods#
There is a new channel() method in the Realtime library, which will be used for our Multiplayer updates.
```channel()```
```channel()```
We will deprecate the .from().on().subscribe() method previously used for listening to postgres changes.
```.from().on().subscribe()```
```.from().on().subscribe()```
```_21supabase_21  .channel('any_string_you_want')_21  .on('presence', { event: 'track' }, (payload) => {_21    console.log(payload)_21  })_21  .subscribe()_21_21supabase_21  .channel('any_string_you_want')_21  .on(_21    'postgres_changes',_21    {_21      event: 'INSERT',_21      schema: 'public',_21      table: 'movies',_21    },_21    (payload) => {_21      console.log(payload)_21    }_21  )_21  .subscribe()```
Deprecated setAuth()#
Deprecated and removed setAuth() . To set a custom access_token jwt instead, pass the custom header into the createClient() method provided: (PR)
```setAuth()```
```access_token```
```createClient()```
```setAuth()```
```access_token```
```createClient()```
All changes#
```supabase-js```
```shouldThrowOnError```
```postgrest-js```
```undefined```
```null```
```cs```
```contains```
```body```
```data```
```upsert```
```.insert()```
```auth```
```PostgrestClient```
```throwOnError```
```gotrue-js```
```supabase-js```
```storageKey```
```signIn```
```signInWithPassword```
```signInWithOtp```
```signInWithOAuth```
```session()```
```user()```
```getSession()```
```getSession()```
```multitab```
```getSession()```
```AuthSessionMissingError```
```AuthNoCookieError```
```AuthInvalidCredentialsError```
```api```
```admin```
```admin```
```resetPasswordForEmail```
```getUser```
```updateUser```
```GoTrueClient```
```supabase.auth```
```supabase-js```
```supabase.auth.api```
```sendMobileOTP```
```sendMagicLinkEmail```
```signInWithOtp```
```signInWithEmail```
```signInWithPhone```
```signInWithPassword```
```signUpWithEmail```
```signUpWithPhone```
```signUp```
```update```
```updateUser```
```storage-js```
```upload```
```update```
```path```
```path```
```Key```
```getPublicURL```
```signedUrl```
```signedURL```
```createSignedUrl```
```createSignedUrls```
```createSignedUrl```
```createSignedUrls```
```getPublicUrl```
```createsignedUrl```
```createBucket```
```SupabaseStorageClient```
```StorageClient```
```realtime-js```
```RealtimeSubscription```
```RealtimeChannel```
```RealtimeClient```
```disconnect```
```void```
```Promise<{ error: Error | null; data: boolean }```
```removeAllSubscriptions```
```removeSubscription```
```SupabaseClient```
```SupabaseRealtimeClient```
```SupabaseQueryBuilder```
```SupabaseEventTypes```
```RealtimePostgresChangeEvents```
```realtime-js```
```.from(’table’).on(’INSERT’, () ⇒ {}).subscribe()```
```functions-js```
```FunctionsHttpError```
```FunctionsRelayError```
```FunctionsFetchError```
```Content-Type```
```Blob```
```ArrayBuffer```
```File```
```FormData```
```String```
```json```
```application/json```
```responseType```
```Content-Type```
```text```
```json```
```blob```
```form-data```
```text```
Need some help?
Latest product updates?
Something's not right?

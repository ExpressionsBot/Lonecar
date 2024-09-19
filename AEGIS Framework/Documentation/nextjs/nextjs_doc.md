# Introduction

Welcome to the Next.js documentation!


## [What is Next.js?](#what-is-nextjs)


Next.js is a React framework for building full\-stack web applications. You use React Components to build user interfaces, and Next.js for additional features and optimizations.


Under the hood, Next.js also abstracts and automatically configures tooling needed for React, like bundling, compiling, and more. This allows you to focus on building your application instead of spending time with configuration.


Whether you're an individual developer or part of a larger team, Next.js can help you build interactive, dynamic, and fast React applications.


## [Main Features](#main-features)


Some of the main Next.js features include:




| Feature | Description |
| --- | --- |
| [Routing](/docs/app/building-your-application/routing) | A file\-system based router built on top of Server Components that supports layouts, nested routing, loading states, error handling, and more. |
| [Rendering](/docs/app/building-your-application/rendering) | Client\-side and Server\-side Rendering with Client and Server Components. Further optimized with Static and Dynamic Rendering on the server with Next.js. Streaming on Edge and Node.js runtimes. |
| [Data Fetching](/docs/app/building-your-application/data-fetching) | Simplified data fetching with async/await in Server Components, and an extended `fetch` API for request memoization, data caching and revalidation. |
| [Styling](/docs/app/building-your-application/styling) | Support for your preferred styling methods, including CSS Modules, Tailwind CSS, and CSS\-in\-JS |
| [Optimizations](/docs/app/building-your-application/optimizing) | Image, Fonts, and Script Optimizations to improve your application's Core Web Vitals and User Experience. |
| [TypeScript](/docs/app/building-your-application/configuring/typescript) | Improved support for TypeScript, with better type checking and more efficient compilation, as well as custom TypeScript Plugin and type checker. |


## [How to Use These Docs](#how-to-use-these-docs)


On the left side of the screen, you'll find the docs navbar. The pages of the docs are organized sequentially, from basic to advanced, so you can follow them step\-by\-step when building your application. However, you can read them in any order or skip to the pages that apply to your use case.


On the right side of the screen, you'll see a table of contents that makes it easier to navigate between sections of a page. If you need to quickly find a page, you can use the search bar at the top, or the search shortcut (`Ctrl+K` or `Cmd+K`).


To get started, check out the [Installation](/docs/getting-started/installation) guide.


## [App Router vs Pages Router](#app-router-vs-pages-router)


Next.js has two different routers: the App Router and the Pages Router. The App Router is a newer router that allows you to use React's latest features, such as Server Components and Streaming. The Pages Router is the original Next.js router, which allowed you to build server\-rendered React applications and continues to be supported for older Next.js applications.


At the top of the sidebar, you'll notice a dropdown menu that allows you to switch between the **App Router** and the **Pages Router** features. Since there are features that are unique to each directory, it's important to keep track of which tab is selected.


The breadcrumbs at the top of the page will also indicate whether you're viewing App Router docs or Pages Router docs.


## [Pre\-Requisite Knowledge](#pre-requisite-knowledge)


Although our docs are designed to be beginner\-friendly, we need to establish a baseline so that the docs can stay focused on Next.js functionality. We'll make sure to provide links to relevant documentation whenever we introduce a new concept.


To get the most out of our docs, it's recommended that you have a basic understanding of HTML, CSS, and React. If you need to brush up on your React skills, check out our [React Foundations Course](/learn/react-foundations), which will introduce you to the fundamentals. Then, learn more about Next.js by [building a dashboard application](/learn/dashboard-app).


## [Accessibility](#accessibility)


For optimal accessibility when using a screen reader while reading the docs, we recommend using Firefox and NVDA, or Safari and VoiceOver.


## [Join our Community](#join-our-community)


If you have questions about anything related to Next.js, you're always welcome to ask our community on [GitHub Discussions](https://github.com/vercel/next.js/discussions), [Discord](https://discord.com/invite/bUG2bvbtHy), [X (Twitter)](https://x.com/nextjs), and [Reddit](https://www.reddit.com/r/nextjs).

[### Getting Started

Learn how to create full\-stack web applications with Next.js.](/docs/getting-started)[### App Router

Use the new App Router with Next.js' and React's latest features, including Layouts, Server Components, Suspense, and more.](/docs/app)[### Pages Router

Before Next.js 13, the Pages Router was the main way to create routes in Next.js with an intuitive file\-system router.](/docs/pages)[### Architecture

How Next.js Works](/docs/architecture)[### Community

Get involved in the Next.js community.](/docs/community)[NextInstallation](/docs/getting-started/installation)Was this helpful?




supported.Send

## Detailed Sections

## Routing
[App Router](/docs/app)[Building Your Application](/docs/app/building-your-application)Routing# Routing Fundamentals

The skeleton of every application is routing. This page will introduce you to the **fundamental concepts** of routing for the web and how to handle routing in Next.js.


## [Terminology](#terminology)


First, you will see these terms being used throughout the documentation. Here's a quick reference:


![Terminology for Component Tree](/_next/image?url=%2Fdocs%2Flight%2Fterminology-component-tree.png&w=3840&q=75)![Terminology for Component Tree](/_next/image?url=%2Fdocs%2Fdark%2Fterminology-component-tree.png&w=3840&q=75)
* **Tree:** A convention for visualizing a hierarchical structure. For example, a component tree with parent and children components, a folder structure, etc.
* **Subtree:** Part of a tree, starting at a new root (first) and ending at the leaves (last).
* **Root**: The first node in a tree or subtree, such as a root layout.
* **Leaf:** Nodes in a subtree that have no children, such as the last segment in a URL path.


![Terminology for URL Anatomy](/_next/image?url=%2Fdocs%2Flight%2Fterminology-url-anatomy.png&w=3840&q=75)![Terminology for URL Anatomy](/_next/image?url=%2Fdocs%2Fdark%2Fterminology-url-anatomy.png&w=3840&q=75)
* **URL Segment:** Part of the URL path delimited by slashes.
* **URL Path:** Part of the URL that comes after the domain (composed of segments).


## [The `app` Router](#the-app-router)


In version 13, Next.js introduced a new **App Router** built on [React Server Components](/docs/app/building-your-application/rendering/server-components), which supports shared layouts, nested routing, loading states, error handling, and more.


The App Router works in a new directory named `app`. The `app` directory works alongside the `pages` directory to allow for incremental adoption. This allows you to opt some routes of your application into the new behavior while keeping other routes in the `pages` directory for previous behavior. If your application uses the `pages` directory, please also see the [Pages Router](/docs/pages/building-your-application/routing) documentation.



> **Good to know**: The App Router takes priority over the Pages Router. Routes across directories should not resolve to the same URL path and will cause a build\-time error to prevent a conflict.


![Next.js App Directory](/_next/image?url=%2Fdocs%2Flight%2Fnext-router-directories.png&w=3840&q=75)![Next.js App Directory](/_next/image?url=%2Fdocs%2Fdark%2Fnext-router-directories.png&w=3840&q=75)
By default, components inside `app` are [React Server Components](/docs/app/building-your-application/rendering/server-components). This is a performance optimization and allows you to easily adopt them, and you can also use [Client Components](/docs/app/building-your-application/rendering/client-components).



> **Recommendation:** Check out the [Server](/docs/app/building-your-application/rendering/server-components) page if you're new to Server Components.


## [Roles of Folders and Files](#roles-of-folders-and-files)


Next.js uses a file\-system based router where:


* **Folders** are used to define routes. A route is a single path of nested folders, following the file\-system hierarchy from the **root folder** down to a final **leaf folder** that includes a `page.js` file. See [Defining Routes](/docs/app/building-your-application/routing/defining-routes).
* **Files** are used to create UI that is shown for a route segment. See [special files](#file-conventions).


## [Route Segments](#route-segments)


Each folder in a route represents a **route segment**. Each route segment is mapped to a corresponding **segment** in a **URL path**.


![How Route Segments Map to URL Segments](/_next/image?url=%2Fdocs%2Flight%2Froute-segments-to-path-segments.png&w=3840&q=75)![How Route Segments Map to URL Segments](/_next/image?url=%2Fdocs%2Fdark%2Froute-segments-to-path-segments.png&w=3840&q=75)
## [Nested Routes](#nested-routes)


To create a nested route, you can nest folders inside each other. For example, you can add a new `/dashboard/settings` route by nesting two new folders in the `app` directory.


The `/dashboard/settings` route is composed of three segments:


* `/` (Root segment)
* `dashboard` (Segment)
* `settings` (Leaf segment)


## [File Conventions](#file-conventions)


Next.js provides a set of special files to create UI with specific behavior in nested routes:




|  |  |
| --- | --- |
| [`layout`](/docs/app/building-your-application/routing/layouts-and-templates#layouts) | Shared UI for a segment and its children |
| [`page`](/docs/app/building-your-application/routing/pages) | Unique UI of a route and make routes publicly accessible |
| [`loading`](/docs/app/building-your-application/routing/loading-ui-and-streaming) | Loading UI for a segment and its children |
| [`not-found`](/docs/app/api-reference/file-conventions/not-found) | Not found UI for a segment and its children |
| [`error`](/docs/app/building-your-application/routing/error-handling) | Error UI for a segment and its children |
| [`global-error`](/docs/app/building-your-application/routing/error-handling) | Global Error UI |
| [`route`](/docs/app/building-your-application/routing/route-handlers) | Server\-side API endpoint |
| [`template`](/docs/app/building-your-application/routing/layouts-and-templates#templates) | Specialized re\-rendered Layout UI |
| [`default`](/docs/app/api-reference/file-conventions/default) | Fallback UI for [Parallel Routes](/docs/app/building-your-application/routing/parallel-routes) |



> **Good to know**: `.js`, `.jsx`, or `.tsx` file extensions can be used for special files.


## [Component Hierarchy](#component-hierarchy)


The React components defined in special files of a route segment are rendered in a specific hierarchy:


* `layout.js`
* `template.js`
* `error.js` (React error boundary)
* `loading.js` (React suspense boundary)
* `not-found.js` (React error boundary)
* `page.js` or nested `layout.js`


![Component Hierarchy for File Conventions](/_next/image?url=%2Fdocs%2Flight%2Ffile-conventions-component-hierarchy.png&w=3840&q=75)![Component Hierarchy for File Conventions](/_next/image?url=%2Fdocs%2Fdark%2Ffile-conventions-component-hierarchy.png&w=3840&q=75)
In a nested route, the components of a segment will be nested **inside** the components of its parent segment.


![Nested File Conventions Component Hierarchy](/_next/image?url=%2Fdocs%2Flight%2Fnested-file-conventions-component-hierarchy.png&w=3840&q=75)![Nested File Conventions Component Hierarchy](/_next/image?url=%2Fdocs%2Fdark%2Fnested-file-conventions-component-hierarchy.png&w=3840&q=75)
## [Colocation](#colocation)


In addition to special files, you have the option to colocate your own files (e.g. components, styles, tests, etc) inside folders in the `app` directory.


This is because while folders define routes, only the contents returned by `page.js` or `route.js` are publicly addressable.


![An example folder structure with colocated files](/_next/image?url=%2Fdocs%2Flight%2Fproject-organization-colocation.png&w=3840&q=75)![An example folder structure with colocated files](/_next/image?url=%2Fdocs%2Fdark%2Fproject-organization-colocation.png&w=3840&q=75)
Learn more about [Project Organization and Colocation](/docs/app/building-your-application/routing/colocation).


## [Advanced Routing Patterns](#advanced-routing-patterns)


The App Router also provides a set of conventions to help you implement more advanced routing patterns. These include:


* [Parallel Routes](/docs/app/building-your-application/routing/parallel-routes): Allow you to simultaneously show two or more pages in the same view that can be navigated independently. You can use them for split views that have their own sub\-navigation. E.g. Dashboards.
* [Intercepting Routes](/docs/app/building-your-application/routing/intercepting-routes): Allow you to intercept a route and show it in the context of another route. You can use these when keeping the context for the current page is important. E.g. Seeing all tasks while editing one task or expanding a photo in a feed.


These patterns allow you to build richer and more complex UIs, democratizing features that were historically complex for small teams and individual developers to implement.


## [Next Steps](#next-steps)


Now that you understand the fundamentals of routing in Next.js, follow the links below to create your first routes:

[### Defining Routes

Learn how to create your first route in Next.js.](/docs/app/building-your-application/routing/defining-routes)[### Pages

Create your first page in Next.js](/docs/app/building-your-application/routing/pages)[### Layouts and Templates

Create your first shared layout in Next.js.](/docs/app/building-your-application/routing/layouts-and-templates)[### Linking and Navigating

Learn how navigation works in Next.js, and how to use the Link Component and \`useRouter\` hook.](/docs/app/building-your-application/routing/linking-and-navigating)[### Error Handling

Learn how to display expected errors and handle uncaught exceptions.](/docs/app/building-your-application/routing/error-handling)[### Loading UI and Streaming

Built on top of Suspense, Loading UI allows you to create a fallback for specific route segments, and automatically stream content as it becomes ready.](/docs/app/building-your-application/routing/loading-ui-and-streaming)[### Redirecting

Learn the different ways to handle redirects in Next.js.](/docs/app/building-your-application/routing/redirecting)[### Route Groups

Route Groups can be used to partition your Next.js application into different sections.](/docs/app/building-your-application/routing/route-groups)[### Project Organization

Learn how to organize your Next.js project and colocate files.](/docs/app/building-your-application/routing/colocation)[### Dynamic Routes

Dynamic Routes can be used to programmatically generate route segments from dynamic data.](/docs/app/building-your-application/routing/dynamic-routes)[### Parallel Routes

Simultaneously render one or more pages in the same view that can be navigated independently. A pattern for highly dynamic applications.](/docs/app/building-your-application/routing/parallel-routes)[### Intercepting Routes

Use intercepting routes to load a new route within the current layout while masking the browser URL, useful for advanced routing patterns such as modals.](/docs/app/building-your-application/routing/intercepting-routes)[### Route Handlers

Create custom request handlers for a given route using the Web's Request and Response APIs.](/docs/app/building-your-application/routing/route-handlers)[### Middleware

Learn how to use Middleware to run code before a request is completed.](/docs/app/building-your-application/routing/middleware)[### Internationalization

Add support for multiple languages with internationalized routing and localized content.](/docs/app/building-your-application/routing/internationalization)[PreviousBuilding Your Application](/docs/app/building-your-application)[NextDefining Routes](/docs/app/building-your-application/routing/defining-routes)Was this helpful?




supported.Send

## Rendering
[App Router](/docs/app)[Building Your Application](/docs/app/building-your-application)Rendering# Rendering

Rendering converts the code you write into user interfaces. React and Next.js allow you to create hybrid web applications where parts of your code can be rendered on the server or the client. This section will help you understand the differences between these rendering environments, strategies, and runtimes.


## [Fundamentals](#fundamentals)


To start, it's helpful to be familiar with three foundational web concepts:


* The [Environments](#rendering-environments) your application code can be executed in: the server and the client.
* The [Request\-Response Lifecycle](#request-response-lifecycle) that's initiated when a user visits or interacts with your application.
* The [Network Boundary](#network-boundary) that separates server and client code.


### [Rendering Environments](#rendering-environments)


There are two environments where web applications can be rendered: the client and the server.


![Client and Server Environments](/_next/image?url=%2Fdocs%2Flight%2Fclient-and-server-environments.png&w=3840&q=75)![Client and Server Environments](/_next/image?url=%2Fdocs%2Fdark%2Fclient-and-server-environments.png&w=3840&q=75)
* The **client** refers to the browser on a user's device that sends a request to a server for your application code. It then turns the response from the server into a user interface.
* The **server** refers to the computer in a data center that stores your application code, receives requests from a client, and sends back an appropriate response.


Historically, developers had to use different languages (e.g. JavaScript, PHP) and frameworks when writing code for the server and the client. With React, developers can use the **same language** (JavaScript), and the **same framework** (e.g. Next.js or your framework of choice). This flexibility allows you to seamlessly write code for both environments without context switching.


However, each environment has its own set of capabilities and constraints. Therefore, the code you write for the server and the client is not always the same. There are certain operations (e.g. data fetching or managing user state) that are better suited for one environment over the other.


Understanding these differences is key to effectively using React and Next.js. We'll cover the differences and use cases in more detail on the [Server](/docs/app/building-your-application/rendering/server-components) and [Client](/docs/app/building-your-application/rendering/client-components) Components pages, for now, let's continue building on our foundation.


### [Request\-Response Lifecycle](#request-response-lifecycle)


Broadly speaking, all websites follow the same **Request\-Response Lifecycle**:


1. **User Action:** The user interacts with a web application. This could be clicking a link, submitting a form, or typing a URL directly into the browser's address bar.
2. **HTTP Request:** The client sends an [HTTP](https://developer.mozilla.org/docs/Web/HTTP) request to the server that contains necessary information about what resources are being requested, what method is being used (e.g. `GET`, `POST`), and additional data if necessary.
3. **Server:** The server processes the request and responds with the appropriate resources. This process may take a couple of steps like routing, fetching data, etc.
4. **HTTP Response:** After processing the request, the server sends an HTTP response back to the client. This response contains a status code (which tells the client whether the request was successful or not) and requested resources (e.g. HTML, CSS, JavaScript, static assets, etc).
5. **Client:** The client parses the resources to render the user interface.
6. **User Action:** Once the user interface is rendered, the user can interact with it, and the whole process starts again.


A major part of building a hybrid web application is deciding how to split the work in the lifecycle, and where to place the Network Boundary.


### [Network Boundary](#network-boundary)


In web development, the **Network Boundary** is a conceptual line that separates the different environments. For example, the client and the server, or the server and the data store.



In React, you choose where to place the client\-server network boundary wherever it makes the most sense.


Behind the scenes, the work is split into two parts: the **client module graph** and the **server module graph**. The server module graph contains all the components that are rendered on the server, and the client module graph contains all components that are rendered on the client.



It may be helpful to think about module graphs as a visual representation of how files in your application depend on each other.



You can use the React `"use client"` convention to define the boundary. There's also a `"use server"` convention, which tells React to do some computational work on the server.


## [Building Hybrid Applications](#building-hybrid-applications)


When working in these environments, it's helpful to think of the flow of the code in your application as **unidirectional**. In other words, during a response, your application code flows in one direction: from the server to the client.



If you need to access the server from the client, you send a **new** request to the server rather than re\-use the same request. This makes it easier to understand where to render your components and where to place the Network Boundary.


In practice, this model encourages developers to think about what they want to execute on the server first, before sending the result to the client and making the application interactive.


This concept will become clearer when we look at how you can [interleave client and server components](/docs/app/building-your-application/rendering/composition-patterns) in the same component tree.

[### Server Components

Learn how you can use React Server Components to render parts of your application on the server.](/docs/app/building-your-application/rendering/server-components)[### Client Components

Learn how to use Client Components to render parts of your application on the client.](/docs/app/building-your-application/rendering/client-components)[### Composition Patterns

Recommended patterns for using Server and Client Components.](/docs/app/building-your-application/rendering/composition-patterns)[### Partial Prerendering

Learn how to combine the benefits of static and dynamic rendering with Partial Prerendering.](/docs/app/building-your-application/rendering/partial-prerendering)[### Runtimes

Learn about the switchable runtimes (Edge and Node.js) in Next.js.](/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)[PreviousIncremental Static Regeneration (ISR)](/docs/app/building-your-application/data-fetching/incremental-static-regeneration)[NextServer Components](/docs/app/building-your-application/rendering/server-components)Was this helpful?




supported.Send

## Data Fetching
[App Router](/docs/app)[Building Your Application](/docs/app/building-your-application)Data Fetching# Data Fetching

[### Data Fetching and Caching

Learn best practices for fetching data on the server or client in Next.js.](/docs/app/building-your-application/data-fetching/fetching)[### Server Actions and Mutations

Learn how to handle form submissions and data mutations with Next.js.](/docs/app/building-your-application/data-fetching/server-actions-and-mutations)[### Incremental Static Regeneration (ISR)

Learn how to create or update static pages at runtime with Incremental Static Regeneration.](/docs/app/building-your-application/data-fetching/incremental-static-regeneration)[PreviousInternationalization](/docs/app/building-your-application/routing/internationalization)[NextData Fetching and Caching](/docs/app/building-your-application/data-fetching/fetching)Was this helpful?




supported.Send
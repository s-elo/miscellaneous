# Miscellaneous

## What is it

This is a repo for playgrounds, demos and experiments of all sorts of frameworks and tools.

## Why

There are lots of frameworks and tools for me to choose when I build up projects, and sometimes I need to do some comparisons among those frameworks and tools in various apsects. 

However, it can be quite a hassle to find a place to try them, especially when I want to save the demos and refer to them when I need. 

Of course, I can create repos for each of the demo, but that would propably end up being so many repos and it could be hard to find when I want to refer to one of them.

What's more, it can provide me a sense of collection, which makes me easy to just start to try the new thing I find out.

## Run Task

```bash
$ pnpm start [Command] [ProjectName]
```

## Dev

```bash
$ pnpm dev [ProjectName]

# or
$ pnpm start dev [ProjectName]
```

## List

### vue-basic

```bash
$ pnpm dev vue-basic
```

Simple vue-related demos:

- vue-router
- pinia
- scss
- massRender(compare with react's useTransition)

### react-basic

```bash
$ pnpm dev react-basic
```

Simple react-relate demos:

- react-router
- zustand
- module scss
- useTransition, useActionState, useFormStatus and useOptimistic

### node-basic

Execute node demos

```bash
$ pnpm exec [demoName]

# e.g. pnpm exec event-loop
```

- event-loop

### apollo-graphql

GraphQl framework for server and client side

### apollo-server

```bash
$ pnpm dev apollo-server
```

### apollo-react

need to firstly start the `apollo-server`

```bash
$ pnpm dev apollo-react
```

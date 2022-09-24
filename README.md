# Orchid Task Orchestrator

- Tasks can have different intentions
  - getting additional data
  - transforming data

### How to deal with Collections?

- i think we need to have a context object that is a utility to run the task

```
  async run(input, ctx) {
    const posts = await ctx.run("scrape-wordpress", "https://url-bullshit");

    await Promise.all(posts.map(post => {
        ctx.run('process-post', post)
    }))
  }
```

### Useful features for tasks

- caching of results of every task (via a Cache Interface)
  - caching requires optional serialization (e.g. prosemirror nodes)
  - Options that can be used for running the overall process
- version of tasks, to invalidate cache as well as call migrations
- input validation (with zod?)
- retry, rate-limit, throttle etc...
  - ?? what is the benefit of having all these functionalities on the task?  
     -> Uniform API
  - Alternative Approach:
    - Setup could be an alternative way of prividing e.g. a queue, or retry just implemeneted on got

#### Setup Logic to provide queueing

```
const rateSimilarity: TaskSpec<null, any, undefined> = {
  name: "process-post",
  setup(){
    return {
        queue: new PQueue()
    }
  }
  async run(input, ctx) {
   return ctx.queue.add(() => {
        console.log("Do the stuff in here")
    })
  },
};
```

### Userful overeall feature

- Observability and debugging tools into the pipeline

### Issues I ran into refactoring

- change the orchestration
  - From a strategy of "fetch everything and then combine the result" -> needs to track the items, and just having the pure result is not sufficient for merging. So I exposed some kind of id, to identify items from a list
    --> change output of certain functions to contain context values
  - There should be some kind of pattern embraced in the scather gather vs map items individual path.
- change the output of certain functions
  - expose more from a raw api call (before we only returned e.g. the text output from a prediction, later we want the metadata as well)
    - This is trouble with caching

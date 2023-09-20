import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import './App.css'

const Posts = [
  { id: 1, title: "post 1" },
  { id: 2, title: "post 5" },
  { id: 2, title: "post 0" },
]

function App() {
  // console.log(Posts);
  const queryClient = useQueryClient()

  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: () => wait(1000).then(() => [...Posts]),
    // staleTime:10000,
    cacheTime:10000,

    // queryFn: () => Promise.reject("Error Message"),
  }

  )

  const newPostMutation = useMutation({
    mutationFn: title => {
      return wait(1000).then(() =>
        Posts.push({ id: crypto.randomUUID(), title })
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"])
    }
  })
// This is typically used to trigger a refetch of the ["posts"] query when a new post is created successfully.
  if (postsQuery.isLoading) return <h1>So Loading.....</h1>
  if (postsQuery.isError) {
    return <pre>{JSON.stringify(postsQuery.error)}</pre>
  }

  return <div>
    {/* <h1>tan stack query check1</h1> */}
    {
      postsQuery.data.map(post => (
        <div key={post.id}>{post.title}</div>
      ))
    }
    <button disabled={newPostMutation.isLoading} onClick={() => newPostMutation.mutate("New Post Added")}>
      Add New
    </button>
  </div>
}
function wait(duration) {
  return new Promise(resolve => setTimeout(resolve, duration))
}
export default App

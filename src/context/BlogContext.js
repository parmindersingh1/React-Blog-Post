import createDataContext from "./createDataContext";
import jsonServer from "./../api/jsonServer";

const blogReducer = (state, action) => {
  switch (action.type) {
    case "get_blogposts":
      return action.payload;

    case "edit_blogpost":
      return state.map(blogPost => {
        return blogPost.id === action.payload.id ? action.payload : blogPost;
      });

    case "delete_blogpost":
      return state.filter(blogPost => blogPost.id !== action.payload);

    // case "add_blogpost":
    //   return [
    //     ...state,
    //     {
    //       id: Math.floor(Math.random() * 99999),
    //       title: action.payload.title,
    //       content: action.payload.content
    //     }
    //   ];
    default:
      return state;
  }
};

const getBlogPosts = dispatch => {
  return async () => {
    try {
      const response = await jsonServer.get("/blogposts");
      // response.data === [{},{},{}]
      dispatch({ type: "get_blogposts", payload: response.data });
    } catch (e) {
      console.log("error", e.message);
    }
  };
};

const addBlogPost = dispatch => {
  return async (title, content, callback) => {
    try {
      await jsonServer.post("/blogposts", { title, content });

      // dispatch({ type: "add_blogpost", payload: { title, content } });
      if (callback) callback();
    } catch (e) {
      console.log("error", e.message);
    }
  };
};

const deleteBlogPost = dispatch => {
  return async id => {
    try {
      await jsonServer.delete(`/blogposts/${id}`);

      dispatch({ type: "delete_blogpost", payload: id });
    } catch (e) {
      console.log("error", e.message);
    }
  };
};

const editBlogPost = dispatch => {
  return async (id, title, content, callback) => {
    try {
      await jsonServer.put(`/blogposts/${id}`, { title, content });

      dispatch({ type: "edit_blogpost", payload: { id, title, content } });
      if (callback) callback();
    } catch (e) {
      console.log("error", e.message);
    }
  };
};

export const { Context, Provider } = createDataContext(
  blogReducer,
  { addBlogPost, deleteBlogPost, editBlogPost, getBlogPosts },
  []
);

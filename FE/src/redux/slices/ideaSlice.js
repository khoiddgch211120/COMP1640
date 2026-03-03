import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  ideas: [
    {
      id: "1",
      title: "An Yêu Tít",
      description: "Upgrade digital borrowing system",
      author: {
        id: "u1",
        name: "John Doe",
        department: "IT"
      },
      isAnonymous: false,
      views: 12,
      upvotes: [],
      downvotes: [],
      comments: [],
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
      title: "Upgrade Campus WiFi",
      description: "Increase bandwidth in main hall",
      author: {
        id: "u2",
        name: "Jane Smith",
        department: "Marketing"
      },
      isAnonymous: false,
      views: 8,
      upvotes: [],
      downvotes: [],
      comments: [],
      createdAt: new Date().toISOString()
    }
  ]
};

const ideaSlice = createSlice({
  name: "ideas",
  initialState,
  reducers: {
    addIdea: {
      reducer: (state, action) => {
        state.ideas.unshift(action.payload);
      },
      prepare: (idea) => ({
        payload: {
          id: nanoid(),
          ...idea,
          views: 0,
          upvotes: [],
          downvotes: [],
          comments: [],
          createdAt: new Date().toISOString()
        }
      })
    }
  }
});

export const { addIdea } = ideaSlice.actions;
export default ideaSlice.reducer;
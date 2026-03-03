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
    },

    /* 👁️ Increase view */
    incrementView: (state, action) => {
      const idea = state.ideas.find(i => i.id === action.payload);
      if (idea) {
        idea.views += 1;
      }
    },

    /* 👍👎 Vote */
    toggleVote: (state, action) => {
      const { ideaId, userId, type } = action.payload;
      const idea = state.ideas.find(i => i.id === ideaId);
      if (!idea) return;

      // remove previous vote
      idea.upvotes = idea.upvotes.filter(id => id !== userId);
      idea.downvotes = idea.downvotes.filter(id => id !== userId);

      if (type === "up") idea.upvotes.push(userId);
      if (type === "down") idea.downvotes.push(userId);
    },

    /* 💬 Add comment */
    addComment: (state, action) => {
      const { ideaId, comment } = action.payload;
      const idea = state.ideas.find(i => i.id === ideaId);
      if (!idea) return;

      idea.comments.push({
        id: nanoid(),
        ...comment,
        createdAt: new Date().toISOString()
      });
    }
  }
});

export const {
  addIdea,
  incrementView,
  toggleVote,
  addComment
} = ideaSlice.actions;

export default ideaSlice.reducer;